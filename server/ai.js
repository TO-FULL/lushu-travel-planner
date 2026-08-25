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
6. 每天的 theme 使用格式 "D1：区域+主题词"，例如 "D1：渝中半岛经典徒步"、"D2：磁器口老街寻味"。

JSON 结构：
{
  "destination": "城市",
  "days": [
    {
      "theme": "D1：区域+主题词",
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

async function generateWithDeepSeek(form) {
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
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: JSON.stringify(form) }
        ],
        temperature: 0.7,
        max_tokens: 6000
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
    const raw = JSON.parse(content);
    return normalizeAiPlan(raw, form);
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

module.exports = { generateWithDeepSeek };
