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

const CITY_COORDS = {
  '北京': [39.90, 116.41], '上海': [31.23, 121.47], '广州': [23.13, 113.26], '深圳': [22.54, 114.06],
  '成都': [30.57, 104.07], '重庆': [29.56, 106.55], '杭州': [30.27, 120.16], '南京': [32.06, 118.80],
  '苏州': [31.30, 120.59], '天津': [39.08, 117.20], '武汉': [30.59, 114.31], '西安': [34.34, 108.94],
  '长沙': [28.23, 112.94], '郑州': [34.75, 113.63], '济南': [36.65, 117.12], '青岛': [36.07, 120.38],
  '厦门': [24.48, 118.09], '福州': [26.07, 119.30], '昆明': [25.04, 102.71], '贵阳': [26.65, 106.63],
  '南宁': [22.82, 108.32], '海口': [20.04, 110.32], '三亚': [18.25, 109.51], '哈尔滨': [45.80, 126.53],
  '长春': [43.82, 125.32], '沈阳': [41.80, 123.43], '大连': [38.91, 121.61], '石家庄': [38.04, 114.51],
  '太原': [37.87, 112.55], '呼和浩特': [40.84, 111.75], '兰州': [36.06, 103.83], '西宁': [36.62, 101.78],
  '银川': [38.49, 106.23], '乌鲁木齐': [43.83, 87.62], '拉萨': [29.65, 91.14], '合肥': [31.82, 117.23],
  '南昌': [28.68, 115.86], '桂林': [25.27, 110.29], '大理': [25.61, 100.27], '丽江': [26.87, 100.23],
  '洛阳': [34.62, 112.45], '香港': [22.32, 114.17], '澳门': [22.20, 113.55], '台北': [25.03, 121.57]
};

const PROVINCE_CAPITAL = {
  '广西': '南宁', '广东': '广州', '四川': '成都', '浙江': '杭州', '云南': '昆明', '海南': '海口',
  '黑龙江': '哈尔滨', '吉林': '长春', '辽宁': '沈阳', '河南': '郑州', '湖北': '武汉', '湖南': '长沙',
  '江苏': '南京', '安徽': '合肥', '福建': '福州', '江西': '南昌', '山东': '济南', '山西': '太原',
  '陕西': '西安', '甘肃': '兰州', '青海': '西宁', '贵州': '贵阳', '河北': '石家庄', '内蒙古': '呼和浩特',
  '新疆': '乌鲁木齐', '西藏': '拉萨', '宁夏': '银川', '台湾': '台北'
};

function geoDistanceKm(a, b) {
  const R = 6371;
  const dLat = (b[0] - a[0]) * Math.PI / 180;
  const dLng = (b[1] - a[1]) * Math.PI / 180;
  const lat1 = a[0] * Math.PI / 180;
  const lat2 = b[0] * Math.PI / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

function resolveCityCoord(name) {
  const city = CITY_COORDS[name];
  if (city) return city;
  const capital = PROVINCE_CAPITAL[name];
  return capital ? CITY_COORDS[capital] : null;
}

function buildTransportByDistance(departCity, destCity) {
  const a = resolveCityCoord(departCity);
  const b = resolveCityCoord(destCity);
  const km = a && b ? geoDistanceKm(a, b) : null;
  const distance = km === null ? 800 : km;
  const roundKm = Math.max(100, Math.round(distance / 50) * 50);
  const from = departCity || '出发城市';
  const to = destCity || '目的地';

  const primaryReason = (mode, arrive, depart, focus) =>
    `从${from}到${to}约 ${roundKm} 公里，${mode}时间效率高，${arrive}抵达正好衔接第一天行程，${depart}出发给返程留足缓冲，${focus}。`;
  const backupReason = (mode, arrive, depart, focus) =>
    `备选${mode}单程耗时更长但票价更省，适合预算优先的出行，${arrive}抵达、${depart}出发，${focus}。`;

  let primary;
  let backup;
  if (distance <= 500) {
    primary = {
      mode: '高铁',
      arriveTime: '上午',
      departTime: '返程当天下午',
      duration: `${Math.max(1, Math.round(roundKm / 250 + 0.5))}-${Math.max(2, Math.round(roundKm / 220 + 0.5))} 小时`,
      priceRange: `约 ¥${Math.round(roundKm * 0.4 / 50) * 50} - ¥${Math.round(roundKm * 0.55 / 50) * 50}`,
      reason: primaryReason('高铁', '上午', '返程当天下午', '把完整白天留给游玩'),
      isBackup: false
    };
    backup = {
      mode: '普速火车',
      arriveTime: '下午',
      departTime: '返程当天上午',
      duration: `${Math.round(roundKm / 140)}-${Math.round(roundKm / 110)} 小时`,
      priceRange: `约 ¥${Math.round(roundKm * 0.18 / 10) * 10} - ¥${Math.round(roundKm * 0.28 / 10) * 10}`,
      reason: backupReason('普速火车', '下午', '返程当天上午', '夜间卧铺还能省一晚住宿'),
      isBackup: true
    };
  } else if (distance <= 1500) {
    primary = {
      mode: '高铁',
      arriveTime: '下午',
      departTime: '返程当天上午',
      duration: `${Math.max(2, Math.round(roundKm / 280 + 0.5))}-${Math.max(3, Math.round(roundKm / 250 + 1))} 小时`,
      priceRange: `约 ¥${Math.round(roundKm * 0.38 / 50) * 50} - ¥${Math.round(roundKm * 0.52 / 50) * 50}`,
      reason: primaryReason('高铁', '下午', '返程当天上午', '把首日安排留给下午和夜晚，返程留足缓冲'),
      isBackup: false
    };
    backup = {
      mode: '飞机',
      arriveTime: '上午',
      departTime: '返程当天下午',
      duration: `约 ${Math.max(2, Math.round(roundKm / 700 + 2))}-${Math.max(3, Math.round(roundKm / 650 + 2.5))} 小时（含机场往返）`,
      priceRange: `约 ¥${Math.max(350, Math.round(roundKm * 0.55 / 50) * 50)} - ¥${Math.max(650, Math.round(roundKm * 0.9 / 50) * 50)}`,
      reason: backupReason('飞机', '上午', '返程当天下午', '中长途飞行节省体力，适合时间敏感场景'),
      isBackup: true
    };
  } else {
    primary = {
      mode: '飞机',
      arriveTime: '上午',
      departTime: '返程当天下午起飞',
      duration: `约 ${Math.max(3, Math.round(roundKm / 700 + 2))}-${Math.max(4, Math.round(roundKm / 650 + 2.5))} 小时（含机场往返）`,
      priceRange: `约 ¥${Math.max(600, Math.round(roundKm * 0.5 / 100) * 100)} - ¥${Math.max(1100, Math.round(roundKm * 0.9 / 100) * 100)}`,
      reason: primaryReason('飞机', '上午', '返程当天下午起飞', '务必预留机场往返市区的通勤时间'),
      isBackup: false
    };
    backup = {
      mode: '高铁',
      arriveTime: '下午',
      departTime: '返程当天上午',
      duration: `${Math.max(6, Math.round(roundKm / 260))}-${Math.max(8, Math.round(roundKm / 240))} 小时`,
      priceRange: `约 ¥${Math.round(roundKm * 0.4 / 50) * 50} - ¥${Math.round(roundKm * 0.55 / 50) * 50}`,
      reason: backupReason('高铁', '下午', '返程当天上午', '长途高铁票价更稳、准点率高，避免机场天气影响'),
      isBackup: true
    };
  }
  return { plans: [primary, backup] };
}

function normalizeDestinationCity(name) {
  const value = String(name || '').trim();
  const capital = PROVINCE_CAPITAL[value];
  return capital ? capital + '市' : value || '目的地';
}

function fallbackLodgingAreas(destCity) {
  const name = normalizeDestinationCity(destCity);
  return [
    { name: `${name}市中心`, tag: '市中心', priceRange: '约 ¥350 - ¥550/晚', pros: '交通便利、餐饮集中，第一次来最稳妥', cons: '高峰期人流量大、停车不便', hotelExamples: `${name}市中心商务酒店` },
    { name: `${name}老城区`, tag: '老城区', priceRange: '约 ¥250 - ¥450/晚', pros: '老街巷与地道小吃多，烟火气足', cons: '部分老楼隔音一般', hotelExamples: `${name}老街精品民宿` },
    { name: `${name}滨水区`, tag: '滨江/湖边', priceRange: '约 ¥400 - ¥650/晚', pros: '景观好、适合散步看夜景', cons: '餐饮选择相对少', hotelExamples: `${name}滨水景观酒店` },
    { name: `${name}文化区`, tag: '文化区', priceRange: '约 ¥300 - ¥500/晚', pros: '博物馆、文创园集中，安静好逛', cons: '夜生活选择偏少', hotelExamples: `${name}文化区设计酒店` }
  ];
}

function normalizeLodgingModule(raw, destCity) {
  const disclaimer = '酒店价格仅为规划参考，实际预订价格请以酒店平台实时信息为准。';
  let areas = null;
  if (Array.isArray(raw)) areas = raw;
  else if (raw && Array.isArray(raw.areas)) areas = raw.areas;
  else if (raw && Array.isArray(raw.list)) areas = raw.list;
  if (!areas || !areas.length) areas = fallbackLodgingAreas(destCity);
  areas = areas.filter(area => area && area.name).slice(0, 4);
  if (!areas.length) areas = fallbackLodgingAreas(destCity);
  return { areas, disclaimer };
}

function monthFromDateStr(dateStr) {
  if (!dateStr) return null;
  const matched = /(\d{4})-(\d{1,2})-(\d{1,2})/.exec(String(dateStr).trim());
  if (matched) return parseInt(matched[2], 10);
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return null;
  return date.getMonth() + 1;
}

function buildSeasonalGuide(ctx) {
  ctx = ctx || {};
  const dest = String(ctx.destination || '当地');
  const month = monthFromDateStr(ctx.startDate);
  if (!month) {
    return {
      weather: '出行季节气候预判，请结合出行日期查询目的地实时天气。',
      clothing: '建议以舒适轻便为主，备一件外套应对室内外温差，具体衣物请结合实时天气调整。'
    };
  }
  if (month >= 3 && month <= 5) {
    return {
      weather: `${dest}当地${month}月处于春季，常年温和多雨，气温约 10-22℃，日照中等，出行建议备好雨伞与薄外套。`,
      clothing: '建议携带薄外套、长袖单衣与雨伞，应对春季昼夜温差和阵雨。'
    };
  }
  if (month >= 6 && month <= 8) {
    return {
      weather: `${dest}当地${month}月处于夏季，常年炎热多雨，气温约 26-35℃，午后多雷阵雨，日照强烈，注意防晒补水。`,
      clothing: '建议携带防晒衣、遮阳帽、雨伞与防晒霜，衣物以透气速干为主。'
    };
  }
  if (month >= 9 && month <= 11) {
    return {
      weather: `${dest}当地${month}月处于秋季，常年凉爽舒适、降水减少，气温约 15-27℃，昼夜温差明显，适合早晚加一件外套。`,
      clothing: '建议携带轻薄外套与长裤，早晚添衣、午后减衣，防晒和雨具各备一件。'
    };
  }
  return {
    weather: `${dest}当地${month}月处于冬季，常年寒冷湿冷，气温约 2-10℃，阴雨偏多、日照偏少，注意保暖防滑。`,
    clothing: '建议携带保暖外套、毛衣、围巾与防滑鞋，怕冷可加保暖内衣。'
  };
}

const SYSTEM_PROMPT = `你是一位专业的旅行行程规划师。根据用户提供的出行信息，生成一份真实、合理、可直接使用的每日行程。

要求：
1. 只输出一个 JSON 对象，不要输出任何其他文字。
2. 行程必须符合真实地理常识：同一天的景点应尽量在同区域或顺路，避免往返折返；给出每个景点的真实名称、所在区域、大致门票/消费（人民币）、建议游玩时长（分钟）和一句实用说明。
3. 每天包含：上午、午餐、下午、晚餐、夜晚五个时段。每个时段可安排 1-3 个项目；上午/下午/夜晚优先安排景点或打卡点，午餐/晚餐安排真实餐厅或美食；不要留大段空白时间。
4. 预算要落在用户预算区间内，住宿和交通费用单列。
5. 结合用户核心偏好（美食/历史/自然/休闲，最多两项）分配重点：美食偏好多安排当地特色餐饮，历史偏好多安排古迹博物馆，自然偏好多安排山水公园，休闲偏好节奏放慢、少排队。
6. 只输出每日行程 JSON，不要在 JSON 中输出任何规划说明性文字（例如“本行程基于优先交通方案生成”“以上安排仅供参考”），这类说明由前端页面统一展示。
7. 最后一天（返程日）只安排上午景点、早餐或午餐，所有游玩项目必须在 12:00 前结束；禁止生成下午、晚餐、夜晚、夜景、夜晚漫步等项目。

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
  if (days.length > 1) {
    const lastDay = days[days.length - 1];
    lastDay.items = lastDay.items.filter(item => item && (item.slotKey === 'morning' || item.slotKey === 'lunch'));
  }

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
    { "name": "片区名", "tag": "区位标签（市中心/老城区/滨江/湖边/文化区等）", "priceRange": "每晚参考价格区间", "pros": "优势理由", "cons": "缺点提醒", "hotelExamples": "1 家示例酒店/民宿名称（仅举例）" }
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
3. 住宿片区推荐是必生成模块，必须输出 3-4 个，禁止为空；按游玩热度从高到低排序，每个片区给出片区名、区位标签、每晚参考价格区间、优势、缺点、1 家示例酒店。
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

  const globalContext = {
    destination: String(form.destination || ''),
    startDate: String(form.startDate || ''),
    endDate: String(form.endDate || ''),
    month: monthFromDateStr(form.startDate)
  };

  // 第一步：生成顶层规划框架
  const framework = await callDeepSeek([
    { role: 'system', content: FRAMEWORK_PROMPT },
    { role: 'user', content: userContent }
  ], 4000);
  // 交通方案改用程序化距离分级，避免模型估算距离出错
  framework.transport = buildTransportByDistance(form.departCity, form.destination);
  // 住宿片区规范化为 { areas, disclaimer }，空值一律触发程序化兜底
  framework.lodgingAreas = normalizeLodgingModule(framework.lodgingAreas, form.destination);
  // 天气穿衣统一从全局上下文读取出发日期月份，程序化生成，不使用模型独立文案
  const seasonalGuide = buildSeasonalGuide(globalContext);
  framework.guide = {
    ...(framework.guide || {}),
    weather: seasonalGuide.weather,
    clothing: seasonalGuide.clothing
  };

  // 第二步：生成每日详细行程，框架作为硬性约束
  const stepFramework = { ...framework, lodgingAreas: framework.lodgingAreas.areas };
  const dailyContent = userContent + `\n\n以下是已确定的顶层规划框架，必须作为硬性约束严格执行：\n${JSON.stringify(stepFramework)}\n\n硬性约束：\n1. 交通基准：只采用 transport.plans 中 isBackup=false 的优先方案。第一天行程强度必须匹配该方案的 arriveTime（如下午抵达则第一天只安排傍晚/夜间活动，不安排上午项目）；最后一天根据 departTime 预留充足返程缓冲时间，不安排卡点游玩项目。备选交通方案仅用于页面展示，不参与行程计算。\n2. 区位基准：以 lodgingAreas 数组中第一条作为游玩中心点，每日景点和就餐点位就近围绕该片区排布，减少远距离往返奔波。\n3. 美食约束：每日午餐/晚餐优先采用 foodList 中的美食，并优先选择靠近中心住宿片区的就餐街区。\n4. 基础约束：严格控制在表单预算上下限内，结合出行偏好（prefs）与补充需求（notes）控制行程节奏。\n5. 输出限制：只输出每日行程 JSON，不要在内容中出现“本行程基于优先交通方案生成”“基于首推住宿片区规划”等说明性文字，这类提示由前端统一展示。\n6. 返程日约束：最后一天只安排上午景点、早餐或午餐，所有游玩项目必须在 12:00 前结束；禁止生成下午、晚餐、夜晚、夜景、夜晚漫步等项目；返程大交通卡片由前端统一生成，不要在 JSON 中输出返程条目。`;
  const raw = await callDeepSeek([
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'user', content: dailyContent }
  ], 6000);
  const plan = normalizeAiPlan(raw, form);
  plan.framework = framework;
  plan.globalContext = globalContext;
  return plan;
}
module.exports = { generateWithDeepSeek, buildSeasonalGuide, monthFromDateStr };
