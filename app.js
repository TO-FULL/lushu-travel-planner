(() => {
  'use strict';

  const STORAGE = {
    plans: 'lushu-plans-v2',
    form: 'lushu-form-v2',
    lastPlan: 'lushu-last-plan-v2'
  };

  const ICONS = {
    food: '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11h16M8 4v4M16 4v4M6 11v8a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-8M14 11v8a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-8"/></svg>',
    photo: '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2Z"/><circle cx="12" cy="13" r="4"/></svg>',
    sight: '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18M5 21V7l7-4 7 4v14M9 9h.01M9 13h.01M9 17h.01M15 9h.01M15 13h.01M15 17h.01"/></svg>',
    walk: '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="m16 8-2.2 5.8L8 16l2.2-5.8z"/></svg>'
  };

  const SLOTS = [
    { key: 'morning', label: '上午', time: '08:30 - 11:30', cats: ['sight', 'photo'] },
    { key: 'lunch', label: '午餐', time: '11:30 - 13:00', cats: ['food'] },
    { key: 'afternoon', label: '下午', time: '13:30 - 17:30', cats: ['sight', 'photo'] },
    { key: 'dinner', label: '晚餐', time: '18:00 - 19:30', cats: ['food'] },
    { key: 'evening', label: '夜晚', time: '20:00 - 22:30', cats: ['photo', 'sight'] }
  ];

  const PACE_TIMES = {
    '深度打卡': { morning: '08:30 - 11:30', lunch: '11:30 - 13:00', afternoon: '13:30 - 17:30', dinner: '18:00 - 19:30', evening: '20:00 - 22:30' },
    '早起休闲': { morning: '07:30 - 10:30', lunch: '11:00 - 12:30', afternoon: '13:00 - 16:30', dinner: '17:30 - 19:00', evening: '20:00 - 21:30' },
    '懒人慢游': { morning: '09:30 - 12:00', lunch: '12:00 - 13:30', afternoon: '14:00 - 18:00', dinner: '18:30 - 20:00' }
  };

  const PREF_META = {
    '美食': { cat: 'food', suffix: '寻味' },
    '历史': { cat: 'sight', suffix: '访古' },
    '自然': { cat: 'sight', suffix: '山水' },
    '休闲': { cat: 'sight', suffix: '慢游' }
  };

  const TEMPLATES = [
    { title: '重庆3日美食游', destination: '重庆', days: 3, budgetMin: 2000, budgetMax: 4500, prefs: ['美食', '休闲'] },
    { title: '上海2日经典', destination: '上海', days: 2, budgetMin: 2000, budgetMax: 4000, prefs: ['历史', '休闲'] },
    { title: '北京4日历史', destination: '北京', days: 4, budgetMin: 5000, budgetMax: 9000, prefs: ['历史', '美食'] },
    { title: '杭州3日山水', destination: '杭州', days: 3, budgetMin: 2500, budgetMax: 5000, prefs: ['自然', '休闲'] },
    { title: '成都3日美食', destination: '成都', days: 3, budgetMin: 2000, budgetMax: 4500, prefs: ['美食', '自然'] },
    { title: '厦门3日休闲', destination: '厦门', days: 3, budgetMin: 2500, budgetMax: 5000, prefs: ['休闲', '自然'] },
    { title: '西安4日历史', destination: '西安', days: 4, budgetMin: 4000, budgetMax: 8000, prefs: ['历史', '美食'] },
    { title: '大理4日自然', destination: '大理', days: 4, budgetMin: 3000, budgetMax: 6000, prefs: ['自然', '休闲'] },
    { title: '三亚5日度假', destination: '三亚', days: 5, budgetMin: 5000, budgetMax: 10000, prefs: ['休闲', '自然'] },
    { title: '青岛3日休闲', destination: '青岛', days: 3, budgetMin: 2500, budgetMax: 5000, prefs: ['休闲', '美食'] }
  ];

  const CITY_ALIASES = {
    '魔都': '上海', '羊城': '广州', '蓉城': '成都', '锦官城': '成都', '天府': '成都',
    '山城': '重庆', '金陵': '南京', '姑苏': '苏州', '鹏城': '深圳', '星城': '长沙',
    '江城': '武汉', '冰城': '哈尔滨', '杭城': '杭州', '钱塘': '杭州', '榕城': '福州'
  };

  const NOTE_KEYWORDS = [
    { pattern: /老人|长辈|父母/, label: '家庭友好' },
    { pattern: /小孩|儿童|亲子|带娃/, label: '家庭友好' },
    { pattern: /爬山|徒步|登山/, label: '户外徒步' },
    { pattern: /夜景|灯光|夜游/, label: '夜景打卡' },
    { pattern: /拍照|摄影|出片/, label: '摄影出片' },
    { pattern: /不辣|吃辣|辣/, label: '口味偏好' },
    { pattern: /网红|人多|排队/, label: '错峰出行' },
    { pattern: /慢|放松|休闲|悠闲/, label: '慢节奏' },
    { pattern: /寺庙|博物馆|历史|古迹/, label: '人文历史' }
  ];

  const GENERIC_POOL = {
    food: [
      { name: '本地招牌菜', area: '市中心', cost: 90, duration: 90, desc: '找一家口碑不错的老字号，试试当地招牌菜。', tags: ['必吃'], slot: 'lunch' },
      { name: '特色小吃街', area: '老城区', cost: 55, duration: 90, desc: '街头小吃集中地，边走边吃最有烟火气。', tags: ['小吃'], slot: 'lunch' },
      { name: '街角咖啡馆', area: '艺术区', cost: 45, duration: 90, desc: '逛累了找家咖啡馆歇脚，顺便整理照片。', tags: ['休闲'], slot: 'afternoon' },
      { name: '夜市大排档', area: '滨江路', cost: 85, duration: 100, desc: '用一顿热闹的夜市宵夜结束一天。', tags: ['夜市'], slot: 'evening' }
    ],
    sight: [
      { name: '城市地标', area: '市中心', cost: 0, duration: 120, desc: '先去当地最具代表性的地标打卡，建立方位感。', tags: ['经典', '免费'], slot: 'any' },
      { name: '城市博物馆', area: '文化区', cost: 0, duration: 150, desc: '快速了解城市历史与民俗，适合室内慢逛。', tags: ['博物馆', '免费'], slot: 'any' },
      { name: '老街区漫步', area: '老城区', cost: 0, duration: 120, desc: '钻进老街区，感受当地人的日常。', tags: ['老街', '免费'], slot: 'any' },
      { name: '滨水公园', area: '滨江路', cost: 0, duration: 90, desc: '沿河或沿海散步，吹吹风看看本地生活。', tags: ['公园', '免费'], slot: 'any' }
    ],
    photo: [
      { name: '日落观景台', area: '文化区', cost: 0, duration: 90, desc: '提前查好日落时间，登高拍一张城市剪影。', tags: ['日落', '免费'], slot: 'evening' },
      { name: '老街建筑街拍', area: '老城区', cost: 0, duration: 90, desc: '老建筑的门窗与巷弄细节都很适合街拍。', tags: ['街拍', '免费'], slot: 'any' },
      { name: '城市夜景机位', area: '滨江路', cost: 0, duration: 90, desc: '找一座天桥或观景平台，拍车流光轨与城市灯火。', tags: ['夜景', '免费'], slot: 'evening' }
    ]
  };

  const CITIES = (window.LUSHU_CITIES || []);

  const $ = selector => document.querySelector(selector);
  const BACKEND_URL = (window.LUSHU_BACKEND_URL || '').replace(/\/+$/, '');

  let currentPlan = null;
  let toastTimer = null;
  let isGenerating = false;

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function fmtMoney(value) {
    return '¥' + Number(value || 0).toLocaleString('zh-CN');
  }

  function categoryKey(pref) {
    const meta = PREF_META[pref];
    return meta ? meta.cat : null;
  }

  function toDateStr(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  function addDaysOffset(offset) {
    const date = new Date();
    date.setDate(date.getDate() + offset);
    return toDateStr(date);
  }

  function calcDays(startDate, endDate) {
    if (!startDate || !endDate) return null;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = Math.round((end - start) / 86400000) + 1;
    return Number.isFinite(diff) ? clamp(diff, 1, 14) : null;
  }

  function hashString(text) {
    let seed = 7;
    const value = String(text || '');
    for (let i = 0; i < value.length; i++) {
      seed = (seed * 31 + value.charCodeAt(i)) >>> 0;
    }
    return seed;
  }

  function geoDistance(a, b) {
    if (!a || !b) return 0;
    const R = 6371;
    const dLat = (b.lat - a.lat) * Math.PI / 180;
    const dLng = (b.lng - a.lng) * Math.PI / 180;
    const lat1 = a.lat * Math.PI / 180;
    const lat2 = b.lat * Math.PI / 180;
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(h));
  }

  function cityCenter(city) {
    if (!city) return null;
    const known = (window.LUSHU_CITY_CENTERS || {})[city.name];
    if (known) return { lat: known[0], lng: known[1] };
    const seed = hashString(city.name || '目的地');
    return { lat: 21 + (seed % 150) / 10, lng: 97 + ((seed >> 3) % 200) / 10 };
  }

  function areaCoord(city, area) {
    if (!area || !city) return null;
    const cityMap = (window.LUSHU_AREA_COORDS || {})[city.name] || {};
    const direct = cityMap[area];
    if (direct) return { lat: direct[0], lng: direct[1] };
    const center = cityCenter(city);
    if (!center) return null;
    const offsets = {
      '市中心': [0, 0], '老城区': [0.012, 0.010], '滨江路': [0.006, -0.014],
      '文化区': [-0.012, 0.006], '艺术区': [0.008, -0.008], '沿途': [0, 0]
    };
    const offset = offsets[area] || [0, 0];
    return { lat: center.lat + offset[0], lng: center.lng + offset[1] };
  }

  function transferMinutes(city, areaA, areaB) {
    if (!areaA || !areaB || areaA === areaB || areaA === '沿途' || areaB === '沿途') return 10;
    const a = areaCoord(city, areaA);
    const b = areaCoord(city, areaB);
    if (!a || !b) return 20;
    const km = geoDistance(a, b);
    if (km <= 1.2) return Math.max(8, Math.round(km / 0.075) + 4);
    return Math.round((km - 1.2) / 0.5) + 21;
  }

  function transferMode(city, areaA, areaB) {
    const minutes = transferMinutes(city, areaA, areaB);
    if (minutes <= 15) return '步行';
    if (minutes <= 35) return '地铁/公交';
    return '打车';
  }

  function getPool(city, cat) {
    const pool = city && city[cat];
    return pool && pool.length ? pool : GENERIC_POOL[cat];
  }

  function pickFromPool(city, pool, area, slotKey, used, preferMinutes) {
    const candidates = pool.filter(item => item.slot === 'any' || item.slot === slotKey);
    if (!candidates.length) return null;
    const scored = candidates.map(item => {
      let score = Math.random() * 1.5;
      if (area && item.area === area) score += 3;
      if (item.cost === 0) score += 0.4;
      if (!used.has(item.name + '|' + item.area)) score += 4;
      if (Number.isFinite(preferMinutes) && preferMinutes > 0) {
        score += Math.max(-3.5, 3 - Math.abs((item.duration || 90) - preferMinutes) / 45);
      }
      if (area && item.area !== area) {
        const minutes = transferMinutes(city, area, item.area);
        if (minutes <= 15) score += 2;
        else if (minutes <= 30) score += 0.8;
        else if (minutes <= 60) score -= 0.5;
        else score -= 1.6;
      }
      return { item, score };
    }).sort((a, b) => b.score - a.score);
    const fresh = scored.filter(entry => !used.has(entry.item.name + '|' + entry.item.area));
    if (!fresh.length) return null;
    const top = fresh.slice(0, Math.min(5, fresh.length));
    const pickCount = Number.isFinite(preferMinutes) && preferMinutes > 0 ? 1 : 2;
    const picked = top[Math.floor(Math.random() * Math.min(pickCount, top.length))].item;
    used.add(picked.name + '|' + picked.area);
    return picked;
  }

  function walkItem(slot, area, duration = 90) {
    const walkNames = {
      morning: ['清晨街角漫步', '晨间散步'],
      lunch: ['街区闲逛', '午间散步'],
      afternoon: ['自由漫步', '街区闲逛'],
      dinner: ['傍晚沿街走走', '黄昏散步'],
      evening: ['夜色漫步', '夜晚沿街走走']
    };
    const options = walkNames[slot.key] || ['自由漫步'];
    const name = options[hashString(slot.key + area) % options.length];
    return {
      name,
      area,
      cost: 0,
      duration,
      desc: '不赶行程，沿街走走看看，给旅行留一点空白。',
      tags: ['自由', '免费'],
      slot: slot.key
    };
  }

  function simpleMeal(slot) {
    const isMorning = slot.key === 'morning';
    return {
      name: isMorning ? '酒店附近早餐' : slot.key === 'lunch' ? '沿途简餐' : '简单晚餐',
      area: '沿途',
      cost: isMorning ? 20 : 50,
      duration: 60,
      desc: '不特意探店，选一家顺路且口碑不错的店快速解决。',
      tags: ['简餐'],
      slot: slot.key
    };
  }

  function fmtClock(minutes) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0');
  }

  function fillActivitySlot(city, slotWithTime, area, prefCats, lead, used) {
    const [startText, endText] = String(slotWithTime.time || '').split(' - ');
    const startMin = parseTimeToMinutes(startText);
    const endMin = parseTimeToMinutes(endText);
    const total = Number.isFinite(startMin) && Number.isFinite(endMin) ? endMin - startMin : 0;
    if (total <= 0) {
      const walk = walkItem(slotWithTime, area);
      return [{ ...walk, cat: 'walk', slotKey: slotWithTime.key, slotLabel: slotWithTime.label, time: slotWithTime.time }];
    }
    const results = [];
    let cursor = startMin;
    let remaining = total;
    let guard = 0;
    while (results.length < 3 && remaining >= 50 && guard < 10) {
      guard += 1;
      let cat;
      if (results.length === 0) {
        cat = slotWithTime.cats.find(c => lead && c === lead)
          || slotWithTime.cats.find(c => prefCats.includes(c))
          || slotWithTime.cats[0]
          || 'sight';
      } else {
        const usedCats = new Set(results.map(result => result.cat));
        cat = slotWithTime.cats.find(c => c === 'photo' && prefCats.includes(c) && !usedCats.has(c))
          || slotWithTime.cats.find(c => !usedCats.has(c))
          || slotWithTime.cats[0]
          || 'sight';
      }
      const preferMinutes = results.length === 0
        ? Math.min(total * 0.55, 150)
        : Math.max(50, remaining - 60);
      const item = pickFromPool(city, getPool(city, cat), area, slotWithTime.key, used, preferMinutes);
      if (!item) break;
      const transfer = results.length ? transferMinutes(city, results[results.length - 1].area, item.area) : 6;
      const duration = item.duration || 90;
      const need = duration + transfer;
      if (results.length > 0 && need > remaining) {
        used.delete(item.name + '|' + item.area);
        break;
      }
      item.time = `${fmtClock(cursor)} - ${fmtClock(cursor + duration)}`;
      results.push({ ...item, cat, slotKey: slotWithTime.key, slotLabel: slotWithTime.label, time: item.time });
      cursor += need;
      remaining -= need;
    }
    if (!results.length) {
      const walk = walkItem(slotWithTime, area);
      return [{ ...walk, cat: 'walk', slotKey: slotWithTime.key, slotLabel: slotWithTime.label, time: slotWithTime.time }];
    }
    if (remaining >= 45) {
      const fillDuration = Math.min(90, Math.max(45, remaining - 15));
      const fill = walkItem(slotWithTime, area, fillDuration);
      fill.time = `${fmtClock(cursor)} - ${fmtClock(cursor + fillDuration)}`;
      results.push({ ...fill, cat: 'walk', slotKey: slotWithTime.key, slotLabel: slotWithTime.label, time: fill.time });
    }
    return results;
  }

  function fitToBudget(items, target, city, used) {
    const allowance = Math.max(target * 1.08, target + 60);
    for (let i = 0; i < 8; i++) {
      const total = items.reduce((sum, item) => sum + item.cost, 0);
      if (total <= allowance) break;
      const expensive = items
        .filter(item => item.cost > 60 && item.cat !== 'walk')
        .sort((a, b) => b.cost - a.cost)[0];
      if (!expensive) break;
      const pool = getPool(city, expensive.cat).filter(item =>
        item.cost < expensive.cost
        && (item.slot === 'any' || item.slot === expensive.slotKey)
        && !used.has(item.name + '|' + item.area)
      );
      if (!pool.length) break;
      pool.sort((a, b) => a.cost - b.cost);
      const cheaper = pool[0];
      const index = items.indexOf(expensive);
      items[index] = {
        ...items[index],
        name: cheaper.name,
        area: cheaper.area,
        cost: cheaper.cost,
        duration: cheaper.duration,
        desc: cheaper.desc,
        tags: cheaper.tags
      };
      used.add(cheaper.name + '|' + cheaper.area);
    }
    return items;
  }

  function scaleItemCosts(items, activitiesBudget) {
    const rawSum = items.reduce((sum, item) => sum + item.cost, 0);
    if (!rawSum) return;
    const scale = clamp(activitiesBudget * 0.85 / rawSum, 1, 3);
    items.forEach(item => {
      if (item.cost > 0) item.cost = Math.max(5, Math.round(item.cost * scale / 5) * 5);
    });
  }

  function distributeBudget(budget, days) {
    const pattern = [0.8, 1.08, 0.96, 1.12, 1, 1.05, 0.9, 1.08, 0.96, 1, 1.05, 0.92, 1.08, 0.88];
    const weights = Array.from({ length: days }, (_, i) => pattern[i % pattern.length]);
    const weightSum = weights.reduce((sum, weight) => sum + weight, 0);
    const targets = weights.map(weight => Math.max(50, Math.round((budget * weight / weightSum) / 10) * 10));
    let diff = budget - targets.reduce((sum, value) => sum + value, 0);
    let guard = 0;
    while (diff !== 0 && guard < 300) {
      guard += 1;
      const index = diff > 0 ? targets.indexOf(Math.min(...targets)) : targets.indexOf(Math.max(...targets));
      targets[index] += diff > 0 ? 10 : -10;
      if (targets[index] < 0) targets[index] = 0;
      diff = budget - targets.reduce((sum, value) => sum + value, 0);
    }
    return targets;
  }

  function buildDay(city, dayIndex, days, prefs, target, used, options = {}) {
    const areas = city.areas && city.areas.length
      ? city.areas.map(item => typeof item === 'object' ? item.name : item)
      : ['市中心', '老城区', '滨江路', '文化区', '艺术区'];
    const area = areas[dayIndex % areas.length];
    const prefCats = prefs.map(categoryKey).filter(Boolean);
    const themeSuffix = prefs.map(p => PREF_META[p] && PREF_META[p].suffix).filter(Boolean)[0] || '漫游';
    const theme = `D${dayIndex + 1}：${area}${themeSuffix}`;
    const timeMap = PACE_TIMES['深度打卡'];
    let slots = SLOTS.slice();

    const items = slots.flatMap(slot => {
      const time = timeMap[slot.key] || slot.time;
      const slotWithTime = { ...slot, time };
      if (slot.cats.includes('food')) {
        const cat = 'food';
        const item = prefs.includes('美食')
          ? (pickFromPool(city, getPool(city, 'food'), area, slot.key, used) || simpleMeal(slotWithTime))
          : simpleMeal(slotWithTime);
        return [{ ...item, cat, slotKey: slot.key, slotLabel: slot.label, time }];
      }
      const lead = prefCats.length ? prefCats[dayIndex % prefCats.length] : null;
      return fillActivitySlot(city, slotWithTime, area, prefCats, lead, used);
    });

    const rooms = Math.max(1, Math.ceil((options.people || 2) / 2));
    const lodging = Math.max(120, Math.min(Math.round(target * 0.45 / 10) * 10, Math.round(target * 0.3 * Math.min(rooms, 2) / 10) * 10));
    const baseTransport = Math.min(target * 0.18, Math.max(40, Math.round(target * 0.08 * Math.min(rooms, 1.6) / 10) * 10));
    const transport = Math.round(baseTransport / 10) * 10;
    const activitiesBudget = Math.max(100, target - lodging - transport);
    scaleItemCosts(items, activitiesBudget);
    fitToBudget(items, target, city, used);
    const itemsCost = items.reduce((sum, item) => sum + item.cost, 0);
    const cost = itemsCost + lodging + transport;
    let transitMinutes = 0;
    let totalDistanceKm = 0;
    for (let i = 1; i < items.length; i++) {
      transitMinutes += transferMinutes(city, items[i - 1].area, items[i].area);
      totalDistanceKm += geoDistance(areaCoord(city, items[i - 1].area), areaCoord(city, items[i].area));
    }
    return {
      day: dayIndex + 1,
      theme,
      area,
      cost,
      items,
      lodging,
      transport,
      transitMinutes: Math.round(transitMinutes),
      totalDistanceKm: Math.round(totalDistanceKm * 10) / 10
    };
  }

  function generateItinerary(form) {
    const destination = normalizeCity(form.destination);
    const days = form.days;
    const budget = form.budget;
    const prefs = form.prefs;
    const found = CITIES.find(city => city.name === destination);
    const city = found || {
      name: destination,
      region: '目的地',
      tagline: '等你探索',
      areas: ['市中心', '老城区', '滨江路', '文化区', '艺术区'],
      food: GENERIC_POOL.food,
      sight: GENERIC_POOL.sight,
      photo: GENERIC_POOL.photo
    };
    const targets = distributeBudget(budget, days);
    const used = new Set();
    const dayPlans = targets.map((target, index) => buildDay(city, index, days, prefs, target, used, {
      people: form.people
    }));
    const totalCost = dayPlans.reduce((sum, day) => sum + day.cost, 0);
    const counts = { food: 0, photo: 0, sight: 0, walk: 0 };
    const breakdown = { food: 0, photo: 0, sight: 0, lodging: 0, transport: 0 };
    dayPlans.forEach(day => day.items.forEach(item => {
      counts[item.cat] = (counts[item.cat] || 0) + 1;
      if (item.cat !== 'walk') breakdown[item.cat] = (breakdown[item.cat] || 0) + item.cost;
    }));
    dayPlans.forEach(day => {
      breakdown.lodging += day.lodging;
      breakdown.transport += day.transport;
    });
    const plan = {
      id: 'plan-' + Date.now(),
      destination,
      days,
      budget,
      budgetRange: form.budgetRange || { min: budget, max: budget },
      people: form.people || 2,
      startDate: form.startDate || '',
      endDate: form.endDate || '',
      notes: form.notes || '',
      title: `${destination} ${days}天`,
      prefs,
      city: { name: city.name, region: city.region, tagline: city.tagline },
      days: dayPlans,
      dayCount: days,
      summary: {
        totalCost,
        remaining: Math.max(0, budget - totalCost),
        avgDay: Math.round(totalCost / days),
        counts,
        breakdown,
        itemsCount: dayPlans.reduce((sum, day) => sum + day.items.length, 0)
      }
    };
    return dedupePlan(plan);
  }

  function normalizeCity(input) {
    const value = String(input || '').trim();
    if (CITY_ALIASES[value]) return CITY_ALIASES[value];
    return value;
  }

  function recomputePlanSummary(plan) {
    const totalCost = plan.days.reduce((sum, day) => sum + day.cost, 0);
    const counts = { food: 0, photo: 0, sight: 0, walk: 0 };
    const breakdown = { food: 0, photo: 0, sight: 0, lodging: 0, transport: 0 };
    plan.days.forEach(day => {
      day.items.forEach(item => {
        counts[item.cat] = (counts[item.cat] || 0) + 1;
        if (item.cat !== 'walk') breakdown[item.cat] = (breakdown[item.cat] || 0) + item.cost;
      });
      breakdown.lodging += day.lodging;
      breakdown.transport += day.transport;
    });
    plan.summary = {
      totalCost,
      remaining: Math.max(0, plan.budget - totalCost),
      avgDay: Math.round(totalCost / plan.days.length),
      counts,
      breakdown,
      itemsCount: plan.days.reduce((sum, day) => sum + day.items.length, 0)
    };
  }

  function refreshDayCost(day) {
    const itemsCost = day.items.reduce((sum, item) => sum + item.cost, 0);
    day.cost = itemsCost + day.lodging + day.transport;
    return day.cost;
  }

  function cityFor(plan) {
    const found = CITIES.find(cityItem => cityItem.name === plan.destination);
    if (found) return found;
    return {
      name: plan.destination,
      region: '目的地',
      tagline: '等你探索',
      image: '',
      areas: ['市中心', '老城区', '滨江路', '文化区', '艺术区']
    };
  }

  function dedupePlan(plan) {
    if (!plan || !plan.days) return plan;
    const city = cityFor(plan);
    const seen = new Set();
    const placeholderNames = new Set(['酒店附近早餐', '沿途简餐', '简单晚餐']);
    plan.days.forEach(day => {
      day.items.forEach(item => {
        if (!item) return;
        const key = item.name + '|' + item.area;
        const isPlaceholder = item.cat === 'walk' || placeholderNames.has(item.name);
        if (seen.has(key) && !isPlaceholder) {
          const pool = getPool(city, item.cat).filter(candidate =>
            (candidate.slot === 'any' || candidate.slot === item.slotKey)
            && !seen.has(candidate.name + '|' + candidate.area)
          );
          if (pool.length) {
            const candidate = pool[hashString(item.name + item.slotKey + day.day) % pool.length];
            item.name = candidate.name;
            item.area = candidate.area;
            item.cost = candidate.cost;
            item.duration = candidate.duration;
            item.desc = candidate.desc;
            item.tags = candidate.tags;
          } else {
            const walk = walkItem({ key: item.slotKey }, item.area);
            item.name = walk.name;
            item.area = walk.area;
            item.cat = 'walk';
            item.cost = 0;
            item.duration = walk.duration;
            item.desc = walk.desc;
            item.tags = walk.tags;
          }
        }
        seen.add(item.name + '|' + item.area);
      });
    });
    plan.days.forEach(day => {
      let transitMinutes = 0;
      let totalDistanceKm = 0;
      for (let i = 1; i < day.items.length; i++) {
        transitMinutes += transferMinutes(city, day.items[i - 1].area, day.items[i].area);
        totalDistanceKm += geoDistance(areaCoord(city, day.items[i - 1].area), areaCoord(city, day.items[i].area));
      }
      day.transitMinutes = Math.round(transitMinutes);
      day.totalDistanceKm = Math.round(totalDistanceKm * 10) / 10;
      refreshDayCost(day);
    });
    recomputePlanSummary(plan);
    return plan;
  }

  function itemTypeLabel(cat) {
    return { food: '美食', sight: '景点', photo: '打卡', walk: '漫步' }[cat] || '行程';
  }

  function parseTimeToMinutes(timeStr) {
    const match = String(timeStr || '').match(/(\d{1,2}):(\d{2})/);
    if (!match) return null;
    return Number(match[1]) * 60 + Number(match[2]);
  }

  function validatePlan(plan) {
    const risks = [];
    if (!plan || !plan.days) return risks;
    const city = cityFor(plan);
    plan.days.forEach(day => {
      const realItems = day.items.filter(item => item && item.cat !== 'walk');
      let crossCount = 0;
      for (let i = 1; i < realItems.length; i++) {
        const prev = realItems[i - 1];
        const next = realItems[i];
        if (!prev || !next || !prev.area || !next.area) continue;
        if (prev.area !== next.area) {
          crossCount += 1;
          const transfer = transferMinutes(city, prev.area, next.area);
          const prevEnd = parseTimeToMinutes(prev.time);
          const nextStart = parseTimeToMinutes(next.time);
          if (prevEnd != null && nextStart != null && (nextStart - prevEnd) < Math.max(15, transfer - 10)) {
            risks.push(`第 ${day.day} 天 ${prev.slotLabel} → ${next.slotLabel}：${prev.area} 到 ${next.area} 预计需要约 ${transfer} 分钟，当前时段衔接偏紧`);
          }
        }
      }
      if (crossCount > 2) {
        risks.push(`第 ${day.day} 天跨 ${crossCount} 个区域移动，路线较散`);
      }
    });
    return risks.slice(0, 8);
  }

  function overviewHTML(plan) {
    const totalKm = plan.days.reduce((sum, day) => sum + (day.totalDistanceKm || 0), 0);
    const avgWalk = Math.round(totalKm / plan.days.length * 10) / 10;
    const usedPct = Math.min(100, Math.max(4, Math.round(plan.summary.totalCost / plan.budget * 100)));
    const rows = [
      ['餐饮', plan.summary.breakdown.food, 'var(--coral)'],
      ['门票', plan.summary.breakdown.sight, 'var(--green)'],
      ['打卡项目', plan.summary.breakdown.photo, 'var(--sky)'],
      ['住宿预留', plan.summary.breakdown.lodging, '#7a6aa8'],
      ['交通预留', plan.summary.breakdown.transport, '#5f7d8c'],
      ['机动预算', plan.summary.remaining, 'var(--amber)']
    ];
    const now = new Date();
    return `
      <div class="overview-stats">
        <div class="ov-cell"><strong>${plan.days.length}</strong><span>总天数</span></div>
        <div class="ov-cell"><strong>${plan.summary.itemsCount}</strong><span>安排景点</span></div>
        <div class="ov-cell"><strong>约 ${avgWalk} km</strong><span>日均步行</span></div>
        <div class="ov-cell"><strong>${fmtMoney(plan.summary.totalCost)}</strong><span>已安排花费</span></div>
      </div>
      <div class="budget-block">
        <div class="budget-top">
          <span class="budget-amount">${fmtMoney(plan.summary.totalCost)}</span>
          <span class="budget-sub">已安排 / ${fmtMoney(plan.budget)}</span>
        </div>
        <div class="budget-bar"><span class="budget-bar-fill" style="width:${usedPct}%"></span></div>
      </div>
      <div class="breakdown-list">
        ${rows.map(([label, amount, color]) => `
          <div class="breakdown-item">
            <span class="breakdown-dot" style="background:${color}"></span>
            <span>${label}</span>
            <span>${fmtMoney(amount)}</span>
          </div>`).join('')}
      </div>
      <p class="info-note">信息更新于 ${now.getFullYear()} 年 ${now.getMonth() + 1} 月</p>`;
  }

  function itemHTML(plan, item, dayIndex, itemIndex, prevItem) {
    const city = cityFor(plan);
    const transferText = prevItem
      ? `${transferMode(city, prevItem.area, item.area)}约 ${transferMinutes(city, prevItem.area, item.area)} 分钟`
      : '从住宿出发';
    return `
      <article class="timeline-item" data-day="${dayIndex}" data-index="${itemIndex}">
        <div class="slot-meta">
          <span class="slot-label">${item.slotLabel}</span>
          <span class="slot-time">${item.time}</span>
        </div>
        <div class="item-card">
          <div class="item-head">
            <div class="item-title">
              <span class="item-icon cat-${item.cat}">${ICONS[item.cat] || ICONS.walk}</span>
              <h3>${item.name}</h3>
            </div>
            <span class="item-cost">${item.cost ? fmtMoney(item.cost) : '免费'}</span>
          </div>
          <div class="item-meta-row">
            <span class="item-type type-${item.cat}">${itemTypeLabel(item.cat)}</span>
            <span>${item.area}</span>
            ${item.duration ? `<span>约 ${item.duration} 分钟</span>` : ''}
            <span class="transfer-note">↗ ${transferText}</span>
          </div>
          <p class="item-desc">${item.desc}</p>
          ${item.cat === 'walk' ? '' : `
            <div class="item-actions">
              <button class="replace-btn" type="button" data-day="${dayIndex}" data-index="${itemIndex}" aria-label="换一个">换一个</button>
            </div>`}
        </div>
      </article>`;
  }

  function dayCardHTML(plan, day, index) {
    const city = cityFor(plan);
    const itemsHTML = day.items.map((item, itemIndex) => {
      const prevItem = itemIndex > 0 ? day.items[itemIndex - 1] : null;
      return itemHTML(plan, item, index, itemIndex, prevItem);
    }).join('');
    return `
      <details class="day-card" data-day="${index}" ${index === 0 ? 'open' : ''}>
        <summary class="day-card-head">
          <div class="day-theme">
            <span class="day-index-badge">${index + 1}</span>
            <div>
              <strong>${day.theme}</strong>
              <span>第 ${index + 1} 天 · ${fmtMoney(day.cost)} · 约 ${day.totalDistanceKm || 0} km</span>
            </div>
          </div>
          <span class="day-card-chevron" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
          </span>
        </summary>
        <div class="day-card-body">
          <div class="timeline">${itemsHTML}</div>
        </div>
      </details>`;
  }

  function renderResult(plan, options = {}) {
    currentPlan = plan;
    $('#resultTitle').textContent = `${plan.destination} · ${plan.days.length} 天 ${plan.people || 2} 人行程`;
    $('#resultMeta').textContent = `偏好：${plan.prefs.join(' / ') || '无'} · ${plan.startDate} 至 ${plan.endDate}`;
    $('#overviewCard').innerHTML = overviewHTML(plan);
    $('#dayCards').innerHTML = plan.days.map((day, index) => dayCardHTML(plan, day, index)).join('');
    $('#skeletonWrap').hidden = true;
    $('#result').hidden = false;
    if (options.scroll !== false) scrollToEl($('#result'));
  }

  async function renderStreaming(plan) {
    currentPlan = plan;
    $('#resultTitle').textContent = `${plan.destination} · ${plan.days.length} 天 ${plan.people || 2} 人行程`;
    $('#resultMeta').textContent = `偏好：${plan.prefs.join(' / ') || '无'} · ${plan.startDate} 至 ${plan.endDate}`;
    $('#overviewCard').innerHTML = '';
    $('#dayCards').innerHTML = '';
    $('#skeletonWrap').hidden = false;
    $('#skeletonWrap').innerHTML = plan.days.map(() => '<div class="skeleton-card"></div>').join('');
    $('#result').hidden = false;
    scrollToEl($('#result'));
    for (let index = 0; index < plan.days.length; index++) {
      await delay(230);
      const wrapper = document.createElement('div');
      wrapper.innerHTML = dayCardHTML(plan, plan.days[index], index);
      const details = wrapper.querySelector('details');
      if (details) {
        details.open = index === 0;
        $('#dayCards').appendChild(details);
      }
      const skeleton = $('#skeletonWrap').querySelector('.skeleton-card');
      if (skeleton) skeleton.remove();
    }
    await delay(160);
    $('#skeletonWrap').hidden = true;
    $('#skeletonWrap').innerHTML = '';
    $('#overviewCard').innerHTML = overviewHTML(plan);
  }

  function getSavedPlans() {
    try {
      const raw = localStorage.getItem(STORAGE.plans);
      const list = raw ? JSON.parse(raw) : [];
      return Array.isArray(list) ? list : [];
    } catch (err) {
      return [];
    }
  }

  function updateSavedBadge() {
    const count = getSavedPlans().length;
    const badge = $('#savedBadge');
    badge.hidden = count === 0;
    badge.textContent = count;
  }

  function saveCurrentPlan() {
    if (!currentPlan) return;
    const list = getSavedPlans();
    const existingIndex = list.findIndex(item => item.id === currentPlan.id);
    if (existingIndex >= 0) {
      list[existingIndex].plan = currentPlan;
      list[existingIndex].updatedAt = new Date().toLocaleString('zh-CN');
      safeSetItem(STORAGE.plans, list);
      showToast('行程已更新');
    } else {
      list.unshift({
        id: currentPlan.id,
        createdAt: new Date().toLocaleString('zh-CN'),
        plan: currentPlan
      });
      safeSetItem(STORAGE.plans, list.slice(0, 8));
      showToast('已保存到「我的行程」');
    }
    updateSavedBadge();
  }

  function removeSavedPlan(id) {
    const list = getSavedPlans().filter(item => item.id !== id);
    safeSetItem(STORAGE.plans, list);
    renderSavedList();
    updateSavedBadge();
  }

  function renderSavedList() {
    const list = getSavedPlans();
    const container = $('#savedList');
    const empty = $('#savedEmpty');
    empty.hidden = list.length > 0;
    container.innerHTML = list.map(entry => {
      const plan = entry.plan;
      return `
        <div class="saved-item">
          <div class="saved-info">
            <strong>${plan.destination} · ${plan.dayCount || plan.days.length} 天 · ${plan.people || 2} 人</strong>
            <span>预算区间 ${fmtMoney(plan.budgetRange.min)} - ${fmtMoney(plan.budgetRange.max)} · ${plan.prefs.join(' / ')}</span>
            <span>${entry.createdAt}</span>
          </div>
          <div class="saved-actions">
            <button type="button" data-load="${entry.id}">载入</button>
            <button type="button" data-delete="${entry.id}">删除</button>
          </div>
        </div>`;
    }).join('');
    container.querySelectorAll('[data-load]').forEach(button => {
      button.addEventListener('click', () => {
        const entry = getSavedPlans().find(item => item.id === button.dataset.load);
        if (!entry) return;
        renderResult(entry.plan);
        closeSavedModal();
        showToast('已载入行程');
      });
    });
    container.querySelectorAll('[data-delete]').forEach(button => {
      button.addEventListener('click', () => removeSavedPlan(button.dataset.delete));
    });
  }

  function openSavedModal() {
    renderSavedList();
    $('#savedModal').hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function closeSavedModal() {
    $('#savedModal').hidden = true;
    document.body.style.overflow = '';
  }

  function replaceItem(dayIndex, itemIndex) {
    if (!currentPlan || !currentPlan.days[dayIndex]) return;
    const day = currentPlan.days[dayIndex];
    const item = day.items[itemIndex];
    if (!item || item.cat === 'walk') return;
    const city = cityFor(currentPlan);
    const usedAll = new Set();
    currentPlan.days.forEach(d => d.items.forEach(i => usedAll.add(i.name + '|' + i.area)));
    let replaced = pickFromPool(city, getPool(city, item.cat), day.area, item.slotKey, usedAll, item.duration);
    if (!replaced) {
      const usedDay = new Set(day.items.map(i => i.name + '|' + i.area));
      replaced = pickFromPool(city, getPool(city, item.cat), day.area, item.slotKey, usedDay, item.duration);
    }
    if (!replaced || (replaced.name === item.name && replaced.area === item.area)) {
      const pool = getPool(city, item.cat).filter(candidate =>
        (candidate.slot === 'any' || candidate.slot === item.slotKey)
        && !(candidate.name === item.name && candidate.area === item.area)
      );
      if (pool.length) {
        replaced = pool[hashString(item.name + Date.now()) % pool.length];
      }
    }
    if (!replaced) {
      showToast('暂时没有可替换的项目');
      return;
    }
    item.name = replaced.name;
    item.area = replaced.area;
    item.cost = replaced.cost;
    item.duration = replaced.duration;
    item.desc = replaced.desc;
    item.tags = replaced.tags;
    dedupePlan(currentPlan);
    renderResult(currentPlan, { preserveOpen: true, scroll: false });
    persistLastPlan(currentPlan);
    showToast(`已替换为「${replaced.name}」`);
  }

  function renderTemplates() {
    const row = $('#templateRow');
    row.innerHTML = TEMPLATES.map((template, index) => `
      <button class="template-chip" type="button" data-template="${index}">${template.title}</button>
    `).join('');
  }

  function applyTemplate(index) {
    const template = TEMPLATES[index];
    if (!template) return;
    $('#destination').value = template.destination;
    $('#days').value = template.days;
    $('#budgetMin').value = template.budgetMin;
    $('#budgetMax').value = template.budgetMax;
    document.querySelectorAll('input[name="pref"]').forEach(input => {
      input.checked = template.prefs.includes(input.value);
    });
    $('#startDate').value = addDaysOffset(0);
    $('#endDate').value = addDaysOffset(template.days - 1);
    updateBudgetNote();
    updateDaysHint();
    saveFormState();
    showToast(`已填入模板：${template.title}`);
  }

  function parseNoteTags() {
    const text = $('#notes').value;
    const container = $('#parsedTags');
    if (!text.trim()) {
      container.innerHTML = '';
      return;
    }
    const labels = [];
    NOTE_KEYWORDS.forEach(rule => {
      if (rule.pattern.test(text) && !labels.includes(rule.label)) labels.push(rule.label);
    });
    container.innerHTML = labels.map(label => `<span class="parsed-tag">${label}</span>`).join('');
  }

  function readForm() {
    const budgetMin = clamp(parseInt($('#budgetMin').value, 10) || 1000, 500, 100000);
    const budgetMax = clamp(parseInt($('#budgetMax').value, 10) || 6000, 500, 100000);
    const min = Math.min(budgetMin, budgetMax);
    const max = Math.max(budgetMin, budgetMax);
    const fromDates = calcDays($('#startDate').value, $('#endDate').value);
    const days = fromDates || clamp(parseInt($('#days').value, 10) || 1, 1, 14);
    return {
      destination: normalizeCity($('#destination').value),
      startDate: $('#startDate').value,
      endDate: $('#endDate').value,
      people: clamp(parseInt($('#people').value, 10) || 2, 1, 20),
      days,
      budgetMin: min,
      budgetMax: max,
      budget: clamp(Math.round((min + max) / 2), 500, 100000),
      budgetRange: { min, max },
      prefs: [...document.querySelectorAll('input[name="pref"]:checked')].map(input => input.value),
      notes: $('#notes').value.trim()
    };
  }

  function applyForm(form) {
    if (!form) return;
    if (form.destination) $('#destination').value = form.destination;
    if (form.startDate) $('#startDate').value = form.startDate;
    if (form.endDate) $('#endDate').value = form.endDate;
    if (form.people) $('#people').value = form.people;
    if (form.days) $('#days').value = form.days;
    if (form.budgetMin) $('#budgetMin').value = form.budgetMin;
    if (form.budgetMax) $('#budgetMax').value = form.budgetMax;
    if (form.prefs) {
      document.querySelectorAll('input[name="pref"]').forEach(input => {
        input.checked = form.prefs.includes(input.value);
      });
    }
    if (form.notes !== undefined) $('#notes').value = form.notes;
  }

  function saveFormState() {
    try {
      safeSetItem(STORAGE.form, readForm());
    } catch (err) {
      /* 忽略 */
    }
  }

  function restoreFormState() {
    try {
      const raw = localStorage.getItem(STORAGE.form);
      if (raw) applyForm(JSON.parse(raw));
    } catch (err) {
      /* 忽略 */
    }
  }

  function persistLastPlan(plan) {
    try {
      safeSetItem(STORAGE.lastPlan, plan);
    } catch (err) {
      /* 忽略 */
    }
  }

  function restoreLastPlan() {
    try {
      const raw = localStorage.getItem(STORAGE.lastPlan);
      if (!raw) return;
      const plan = JSON.parse(raw);
      if (plan && plan.days && plan.days.length) {
        currentPlan = dedupePlan(plan);
        renderResult(currentPlan, { scroll: false });
      }
    } catch (err) {
      /* 忽略 */
    }
  }

  function updateBudgetNote() {
    const min = clamp(parseInt($('#budgetMin').value, 10) || 0, 0, 100000);
    const max = clamp(parseInt($('#budgetMax').value, 10) || 0, 0, 100000);
    const days = clamp(parseInt($('#days').value, 10) || 1, 1, 14);
    if (!min || !max) {
      $('#budgetNote').textContent = '请填写预算区间';
      return;
    }
    const low = Math.min(min, max);
    const high = Math.max(min, max);
    const mid = Math.round((low + high) / 2);
    $('#budgetNote').textContent = `预算区间 ${fmtMoney(low)} - ${fmtMoney(high)} · 按 ${fmtMoney(mid)} 生成 · 日均约 ${fmtMoney(Math.round(mid / days))}`;
  }

  function updateDaysHint() {
    const days = clamp(parseInt($('#days').value, 10) || 1, 1, 14);
    $('#daysHint').textContent = `共 ${days} 天`;
  }

  function syncDaysFromDates() {
    const days = calcDays($('#startDate').value, $('#endDate').value);
    if (days) {
      $('#days').value = days;
      updateDaysHint();
    }
    saveFormState();
  }

  function validateForm(form) {
    if (!form.destination) return '先告诉我你要去哪儿';
    if (!form.prefs.length) return '至少选择一个核心偏好';
    if (form.prefs.length > 2) return '核心偏好最多选 2 项';
    if (!form.startDate || !form.endDate) return '请选择出行起止日期';
    if (form.startDate > form.endDate) return '返回日期不能早于出发日期';
    if (form.budgetMin > form.budgetMax) return '预算下限不能高于上限';
    return '';
  }

  function showFormError(message) {
    const errorEl = $('#formError');
    errorEl.textContent = message;
    errorEl.hidden = false;
  }

  function hideFormError() {
    $('#formError').hidden = true;
  }

  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  function safeSetItem(key, value) {
    try {
      const json = JSON.stringify(value);
      if (json.length > 1200000) throw new Error('storage-too-large');
      localStorage.setItem(key, json);
    } catch (err) {
      if (key === STORAGE.plans) {
        try {
          const trimmed = Array.isArray(value) ? value.slice(0, 4) : value;
          localStorage.setItem(key, JSON.stringify(trimmed));
        } catch (err2) {
          /* 忽略 */
        }
      }
    }
  }

  function friendlyErrorMessage(err) {
    const msg = err && err.message ? String(err.message) : '';
    if (/timeout|timed out|超时/i.test(msg)) return '生成超时，请稍后重试';
    if (/rate|limit|限流|429/i.test(msg)) return '请求过于频繁，请稍等片刻再试';
    return '生成失败，请稍后重试';
  }

  function scrollToEl(element) {
    if (!element) return;
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function showToast(message) {
    const toast = $('#toast');
    toast.textContent = message;
    toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.hidden = true;
    }, 2400);
  }

  async function apiFetch(path, options = {}) {
    if (!BACKEND_URL) throw new Error('backend-not-configured');
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), options.timeoutMs || 60000);
    try {
      const res = await fetch(BACKEND_URL + path, {
        ...options,
        headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
        signal: controller.signal
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const err = new Error(data.error || '请求失败');
        err.status = res.status;
        throw err;
      }
      return data;
    } finally {
      clearTimeout(timer);
    }
  }

  async function generateWithRetry(form) {
    if (BACKEND_URL) {
      try {
        const data = await apiFetch('/api/generate', {
          method: 'POST',
          body: JSON.stringify({ form }),
          timeoutMs: 90000
        });
        if (data && data.plan) {
          const plan = data.plan;
          plan.id = plan.id || 'plan-' + Date.now();
          plan.destination = plan.destination || form.destination;
          plan.budgetRange = plan.budgetRange || form.budgetRange;
          plan.prefs = plan.prefs || form.prefs;
          return dedupePlan(plan);
        }
      } catch (err) {
        if (err.status && err.status >= 400 && err.status < 500) showToast(err.message);
      }
    }
    return generateItinerary(form);
  }

  function setGenerateLoading(loading) {
    const button = $('#generateBtn');
    button.classList.toggle('is-loading', loading);
    button.disabled = loading;
    $('#progressText').hidden = !loading;
    if (loading) $('#progressText').textContent = '正在规划你的行程…';
    else $('#progressText').textContent = '';
  }

  function handleGenerate() {
    if (isGenerating) return;
    const form = readForm();
    const error = validateForm(form);
    if (error) {
      showFormError(error);
      return;
    }
    hideFormError();
    isGenerating = true;
    setGenerateLoading(true);
    (async () => {
      try {
        await delay(600);
        const plan = await generateWithRetry(form);
        await renderStreaming(plan);
        persistLastPlan(plan);
        saveFormState();
        showToast('行程生成完成');
      } catch (err) {
        console.error(err);
        showToast(friendlyErrorMessage(err));
      } finally {
        setGenerateLoading(false);
        isGenerating = false;
      }
    })();
  }

  function init() {
    const cityOptions = $('#cityOptions');
    cityOptions.innerHTML = CITIES.map(city => `<option value="${city.name}"></option>`).join('');
    renderTemplates();
    restoreFormState();
    if (!$('#startDate').value) $('#startDate').value = addDaysOffset(0);
    if (!$('#endDate').value) $('#endDate').value = addDaysOffset(2);
    updateBudgetNote();
    updateDaysHint();
    updateSavedBadge();

    $('#plannerForm').addEventListener('submit', event => {
      event.preventDefault();
      handleGenerate();
    });
    $('#regenerateBtn').addEventListener('click', handleGenerate);
    $('#navSaved').addEventListener('click', openSavedModal);
    $('#savedClose').addEventListener('click', closeSavedModal);
    $('#savedModal').addEventListener('click', event => {
      if (event.target === $('#savedModal')) closeSavedModal();
    });
    $('#savePlanBtn').addEventListener('click', saveCurrentPlan);
    $('#dayCards').addEventListener('click', event => {
      const btn = event.target.closest('.replace-btn');
      if (!btn) return;
      replaceItem(Number(btn.dataset.day), Number(btn.dataset.index));
    });

    $('#daysMinus').addEventListener('click', () => {
      $('#days').value = clamp((parseInt($('#days').value, 10) || 1) - 1, 1, 14);
      updateDaysHint();
      updateBudgetNote();
      saveFormState();
    });
    $('#daysPlus').addEventListener('click', () => {
      $('#days').value = clamp((parseInt($('#days').value, 10) || 1) + 1, 1, 14);
      updateDaysHint();
      updateBudgetNote();
      saveFormState();
    });
    $('#peopleMinus').addEventListener('click', () => {
      $('#people').value = clamp((parseInt($('#people').value, 10) || 1) - 1, 1, 20);
      saveFormState();
    });
    $('#peoplePlus').addEventListener('click', () => {
      $('#people').value = clamp((parseInt($('#people').value, 10) || 1) + 1, 1, 20);
      saveFormState();
    });
    $('#days').addEventListener('input', () => {
      updateDaysHint();
      updateBudgetNote();
      saveFormState();
    });
    $('#budgetMin').addEventListener('input', () => {
      updateBudgetNote();
      saveFormState();
    });
    $('#budgetMax').addEventListener('input', () => {
      updateBudgetNote();
      saveFormState();
    });
    $('#people').addEventListener('input', saveFormState);
    $('#notes').addEventListener('input', () => {
      parseNoteTags();
      saveFormState();
    });
    $('#destination').addEventListener('input', saveFormState);
    $('#startDate').addEventListener('change', syncDaysFromDates);
    $('#endDate').addEventListener('change', syncDaysFromDates);

    document.querySelectorAll('input[name="pref"]').forEach(input => {
      input.addEventListener('change', () => {
        const checked = [...document.querySelectorAll('input[name="pref"]:checked')];
        if (checked.length > 2) {
          input.checked = false;
          showToast('核心偏好最多选 2 项');
        }
        saveFormState();
      });
    });

    $('#templateRow').addEventListener('click', event => {
      const btn = event.target.closest('.template-chip');
      if (btn) applyTemplate(Number(btn.dataset.template));
    });

    restoreLastPlan();
  }

  init();
})();
