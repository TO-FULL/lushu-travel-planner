const SLOT_DEFAULT_TIME = {
  morning: '08:30 - 11:30',
  lunch: '11:30 - 13:00',
  afternoon: '13:30 - 17:30',
  dinner: '18:00 - 19:30',
  evening: '20:00 - 22:30'
};

const SLOT_LABEL = {
  morning: '上午',
  lunch: '午餐',
  afternoon: '下午',
  dinner: '晚餐',
  evening: '夜晚'
};

const SYSTEM_PROMPT = `你是一位专业的旅行行程规划师。根据用户提供的出行信息，生成一份真实、合理、可直接使用的每日行程。

要求：
1. 只输出一个 JSON 对象，不要输出任何其他文字。
2. 行程必须符合真实地理常识：同一天的景点应尽量在同区域或顺路，避免往返折返；给出每个景点的真实名称、所在区域、大致门票/消费（人民币）、建议游玩时长（分钟）和一句实用说明。
3. 每天包含：上午、午餐、下午、晚餐、夜晚五个时段。每个时段可安排 1-3 个项目；上午/下午/夜晚优先安排景点或打卡点，午餐/晚餐安排真实餐厅或美食；不要留大段空白时间。
4. 预算要落在用户预算区间内，住宿和交通费用单列。
5. 结合用户核心偏好（美食/历史/自然/休闲，最多两项）分配重点：美食偏好多安排当地特色餐饮，历史偏好多安排古迹博物馆，自然偏好多安排山水公园，休闲偏好节奏放慢、少排队。
6. 只输出每日行程 JSON，不要在 JSON 中输出任何规划说明性文字（例如“本行程基于优先交通方案生成”“以上安排仅供参考”），这类说明由前端页面统一展示。

JSON 结构：
{
  "destination": "城市",
  "days": [
    {
      "theme": "当日主题",
      "area": "当日主要活动区域",
      "lodging": { "area": "住宿区域", "type": "酒店/民宿/客栈", "price": 每晚参考价, "desc": "推荐理由", "tags": ["标签"] },
      "transport": 当日交通预估,
      "items": [
        { "slot": "morning|lunch|afternoon|dinner|evening", "name": "项目名称", "area": "所在区域", "cost": 预估费用, "duration": 游玩分钟数, "desc": "实用说明", "tags": ["标签"] }
      ]
    }
  ]
}`;

function inferCat(item, slotKey) {
  if (slotKey === 'lunch' || slotKey === 'dinner') return 'food';
  const text = `${item.name || ''} ${item.desc || ''} ${(item.tags || []).join(' ')}`;
  if (/拍照|夜景|日落|街拍|机位|出片/.test(text)) return 'photo';
  if (/吃|餐|馆|火锅|小吃|美食|菜/.test(text)) return 'food';
  return 'sight';
}

function normalizeAiPlan(raw, form) {
  if (!raw || !Array.isArray(raw.days) || !raw.days.length) {
    throw new Error('AI 返回的行程格式不正确');
  }
  const days = raw.days.map((day, index) => {
    const items = (day.items || []).map(item => {
      const slotKey = String(item.slot || 'morning').trim() in SLOT_LABEL ? String(item.slot).trim() : 'morning';
      const cat = item.cat || inferCat(item, slotKey);
      return {
        name: String(item.name || '').trim() || '自由漫步',
        area: String(item.area || day.area || '市中心').trim(),
        cost: Math.max(0, Math.round(Number(item.cost) || 0)),
        duration: Math.max(30, Math.round(Number(item.duration) || 90)),
        desc: String(item.desc || '').trim(),
        tags: Array.isArray(item.tags) ? item.tags.map(String) : [],
        slot: slotKey,
        slotKey,
        slotLabel: SLOT_LABEL[slotKey],
        time: String(item.time || SLOT_DEFAULT_TIME[slotKey] || ''),
        cat
      };
    });
    const lodging = day.lodging || raw.lodging;
    const lodgingPrice = lodging ? Math.max(100, Math.round(Number(lodging.price) || 0)) : 400;
    const transport = Math.max(0, Math.round(Number(day.transport) || 100));
    const itemsCost = items.reduce((sum, item) => sum + item.cost, 0);
    return {
      day: index + 1,
      theme: String(day.theme || (index === 0 ? '初见城市' : '经典巡礼')),
      area: String(day.area || '市中心'),
      items,
      lodging: lodgingPrice,
      transport,
      baseTransport: transport,
      cost: itemsCost + lodgingPrice + transport
    };
  });

  const totalCost = days.reduce((sum, day) => sum + day.cost, 0);
  const budget = Math.max(1, Math.round(Number(raw.budget) || form.budget || 4000));
  const budgetRange = form.budgetRange || { min: form.budgetMin || budget, max: form.budgetMax || budget };
  const counts = { food: 0, photo: 0, sight: 0, walk: 0 };
  const breakdown = { food: 0, photo: 0, sight: 0, lodging: 0, transport: 0 };
  days.forEach(day => {
    day.items.forEach(item => {
      counts[item.cat] = (counts[item.cat] || 0) + 1;
      if (item.cat !== 'walk') breakdown[item.cat] = (breakdown[item.cat] || 0) + item.cost;
    });
    breakdown.lodging += day.lodging;
    breakdown.transport += day.transport;
  });

  return {
    id: 'plan-' + Date.now(),
    destination: String(raw.destination || form.destination || ''),
    days,
    dayCount: days.length,
    budget,
    budgetRange,
    people: Number(form.people) || 2,
    startDate: form.startDate || '',
    endDate: form.endDate || '',
    notes: form.notes || '',
    crowd: form.crowd || '情侣',
    pace: form.pace || '深度打卡',
    title: `${raw.destination || form.destination} ${days.length}天`,
    prefs: form.prefs || [],
    lodging: (days[0] && raw.lodging) || { area: '市中心', type: '酒店', price: 400, desc: '市中心住宿，出行方便。', tags: ['交通便利'] },
    summary: {
      totalCost,
      remaining: Math.max(0, budget - totalCost),
      avgDay: Math.round(totalCost / days.length),
      counts,
      breakdown,
      itemsCount: days.reduce((sum, day) => sum + day.items.length, 0)
    }
  };
}

const FRAMEWORK_PROMPT = `你是一位旅行规划专家。根据用户出行信息，输出顶层规划框架，只输出一个 JSON 对象，不要输出其他文字。

JSON 结构：
{
  "transport": {
    "plans": [
      {
        "mode": "高铁/飞机/普速火车",
        "arriveTime": "建议抵达时段（上午/下午/傍晚/夜间）",
        "departTime": "建议返程时段",
        "duration": "预估单程时长",
        "priceRange": "参考票价区间",
        "reason": "推荐该时段的具体理由，必须与第一天和最后一天的游玩安排相匹配，给出倾向性建议",
        "isBackup": false
      }
    ]
  },
  "lodgingAreas": [
    { "name": "片区名", "priceRange": "每晚参考价格区间", "pros": "优势理由", "cons": "缺点提醒", "hotelExamples": "1 家示例酒店/民宿名称（仅举例）" }
  ],
  "foodList": [
    { "name": "本地必吃美食名", "area": "推荐就餐街区", "note": "一句话介绍" }
  ],
  "guide": {
    "weather": "按出行月份描述当地常年气候、大致温度范围、降雨与日晒特点",
    "clothing": "贴合当月气候的可落地衣物携带建议",
    "notes": ["游玩注意事项"],
    "pitfalls": ["避坑提醒"],
    "tips": ["出行小贴士"]
  ]
}

要求：
1. 仅根据出发城市与目的地的地理距离估算交通时长，不要调用实时票务接口，不要编造具体车次。按距离分级选择方案：短途（约 500km 内）优先高铁、备选普速火车；中长途（约 500-1500km）优先高铁、备选飞机；长途（约 1500km 以上）优先飞机、备选高铁。每项必须包含抵达时段、返程时段、单程时长（估算）、参考票价区间和明确理由；禁止输出“上午或下午均可”这类模糊套话。
2. 优先与备选两段文案必须原创、避免模板化套话，且侧重点明显不同：优先方案侧重时间效率与第一天游玩衔接，备选方案侧重经济性或直达便捷性；抵返时段建议要与第一天和最后一天的游玩安排相匹配。
3. 住宿片区推荐 3-4 个，按游玩热度从高到低排序，每个片区给出每晚参考价格区间、优势、缺点、1 家示例酒店。
4. 美食只推荐当地必吃美食 4-6 项，不要特产，每项给出推荐就餐街区。
5. guide 中按出行月份给出天气穿衣建议、游玩注意事项、避坑提醒、出行小贴士。weather 必须包含具体温度范围、降雨与日晒特点；clothing 必须给出具体可携带衣物（如薄外套、防晒衣、雨伞），禁止空泛话术。
6. 只做顶层规划，不要输出任何每日景点安排。`;

async function callDeepSeek(messages, maxTokens) {
  const apiKey = process.env.DEEPSEEK_API_KEY || '';
  if (!apiKey) {
    const err = new Error('DEEPSEEK_API_KEY 未配置');
    err.status = 503;
    throw err;
  }
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 90000);
  try {
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + apiKey
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        response_format: { type: 'json_object' },
        messages,
        temperature: 0.7,
        max_tokens: maxTokens
      }),
      signal: controller.signal
    });
    if (!response.ok) {
      let message = 'AI 服务暂时不可用';
      if (response.status === 401) message = 'DeepSeek API Key 无效';
      if (response.status === 429) message = 'AI 请求过于频繁，请稍后再试';
      const err = new Error(message);
      err.status = response.status >= 400 && response.status < 500 ? 400 : 502;
      throw err;
    }
    const data = await response.json();
    const content = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
    if (!content) throw new Error('AI 返回内容为空');
    return JSON.parse(content);
  } catch (err) {
    if (err.name === 'AbortError') {
      const timeoutErr = new Error('AI 生成超时，请稍后重试');
      timeoutErr.status = 504;
      throw timeoutErr;
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

async function generateWithDeepSeek(form) {
  let userContent = JSON.stringify(form);
  if (form.parsedTags && form.parsedTags.length) {
    userContent += `\n\n补充需求已解析为以下约束标签，生成时请纳入考虑：${form.parsedTags.join('、')}`;
  }

  // 第一步：生成顶层规划框架
  const framework = await callDeepSeek([
    { role: 'system', content: FRAMEWORK_PROMPT },
    { role: 'user', content: userContent }
  ], 4000);

  // 第二步：生成每日详细行程，框架作为硬性约束
  const dailyContent = userContent + `\n\n以下是已确定的顶层规划框架，必须作为硬性约束严格执行：\n${JSON.stringify(framework)}\n\n硬性约束：\n1. 交通基准：只采用 transport.plans 中 isBackup=false 的优先方案。第一天行程强度必须匹配该方案的 arriveTime（如下午抵达则第一天只安排傍晚/夜间活动，不安排上午项目）；最后一天根据 departTime 预留充足返程缓冲时间，不安排卡点游玩项目。备选交通方案仅用于页面展示，不参与行程计算。\n2. 区位基准：以 lodgingAreas 数组中第一条作为游玩中心点，每日景点和就餐点位就近围绕该片区排布，减少远距离往返奔波。\n3. 美食约束：每日午餐/晚餐优先采用 foodList 中的美食，并优先选择靠近中心住宿片区的就餐街区。\n4. 基础约束：严格控制在表单预算上下限内，结合出行偏好（prefs）与补充需求（notes）控制行程节奏。\n5. 输出限制：只输出每日行程 JSON，不要在内容中出现“本行程基于优先交通方案生成”“基于首推住宿片区规划”等说明性文字，这类提示由前端统一展示。`;
  const raw = await callDeepSeek([
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: dailyContent }
  ], 6000);
  const plan = normalizeAiPlan(raw, form);
  plan.framework = framework;
  return plan;
}
module.exports = { generateWithDeepSeek };
