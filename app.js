(() => {
  'use strict';

  const STORAGE = {
    plans: 'lushu-itineraries-v1',
    form: 'lushu-form-v1',
    lastPlan: 'lushu-last-plan-v1',
    theme: 'lushu-theme-v1',
    users: 'lushu-users-v1',
    session: 'lushu-session-v1',
    token: 'lushu-token-v1'
  };

  const ICONS = {
    food: '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11h16M8 4v4M16 4v4M6 11v8a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-8M14 11v8a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-8"/></svg>',
    photo: '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2Z"/><circle cx="12" cy="13" r="4"/></svg>',
    sight: '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21h18M5 21V7l7-4 7 4v14M9 9h.01M9 13h.01M9 17h.01M15 9h.01M15 13h.01M15 17h.01"/></svg>',
    walk: '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="m16 8-2.2 5.8L8 16l2.2-5.8z"/></svg>',
    transport: '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h12a4 4 0 0 1 4 4v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"/><path d="M4 11h16M8 17v2M16 17v2"/></svg>',
    stay: '<svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 9v11M2 14h20v6M2 20h20M22 14V9a3 3 0 0 0-3-3H8v8"/><circle cx="6" cy="12" r="1"/></svg>'
  };

  const SLOTS = [
    { key: 'morning', label: '上午', time: '08:30 - 11:30', cats: ['sight', 'photo'] },
    { key: 'lunch', label: '午餐', time: '11:30 - 13:00', cats: ['food'] },
    { key: 'afternoon', label: '下午', time: '13:30 - 17:30', cats: ['sight', 'photo'] },
    { key: 'dinner', label: '晚餐', time: '18:00 - 19:30', cats: ['food'] },
    { key: 'evening', label: '夜晚', time: '20:00 - 22:30', cats: ['photo', 'sight'] }
  ];

  const THEMES = [
    '经典巡礼', '逛吃地图', '秘境漫游', '在地体验', '城市夜游',
    '转角惊喜', '慢游时光', '深度漫游', '烟火人间', '海岸与街巷',
    '轻装上阵', '光影日记'
  ];

  const LOADING_STEPS = [
    '正在整理目的地信息…',
    '正在匹配偏好与预算区间…',
    '正在安排每日路线…',
    '正在计算动线与花费…'
  ];

  const PREF_META = {
    '美食': { cats: ['food'], label: '美食' },
    '历史': { cats: ['sight'], label: '历史' },
    '自然': { cats: ['sight'], label: '自然' },
    '休闲': { cats: ['sight'], label: '休闲' }
  };

  const TEMPLATES = {
    weekend: { destination: '杭州', startOffset: 0, endOffset: 2, people: 2, days: 3, budgetMin: 2000, budgetMax: 4000, prefs: ['休闲', '美食'], notes: '节奏放松一点，适合周末出发' },
    long: { destination: '成都', startOffset: 0, endOffset: 6, people: 2, days: 7, budgetMin: 8000, budgetMax: 15000, prefs: ['美食', '休闲'], notes: '跨省长途，每天不用太赶' },
    deep: { destination: '上海', startOffset: 0, endOffset: 4, people: 1, days: 5, budgetMin: 6000, budgetMax: 10000, prefs: ['美食', '历史'], notes: '城市深度游，博物馆和街区都想去' }
  };

  const DEST_TIPS = {
    成都: ['近期湿热多阵雨，出门带伞并做好防晒', '热门火锅和熊猫基地建议尽早预约、错峰前往', '成都博物馆周一闭馆，出发前确认开放时间', '市区出行建议地铁 + 打车组合，宽窄巷子周边步行更顺'],
    杭州: ['梅雨季潮湿，建议备防水鞋和薄外套', '灵隐寺、西溪湿地可提前线上购票，周一部分博物馆闭馆', '西湖周末和节假日车流大，建议地铁 + 步行', '龙井茶村山路较窄，打车需提前规划返程'],
    重庆: ['山城坡多，穿舒适平底鞋更省力', '洪崖洞、长江索道节假日排队久，建议错峰或提前购票', '夏季闷热，注意补水防晒', '公共交通首选轻轨，打车避开晚高峰'],
    西安: ['夏季炎热干燥，注意防晒和补水', '陕历博、碑林需提前预约，周一闭馆', '兵马俑距离市区较远，建议预留半天往返', '回民街人流密集，错峰用餐体验更好'],
    厦门: ['海边日照强，带防晒霜和遮阳帽', '鼓浪屿船票需提前预约，热门日尽早购票', '台风季留意天气预警，出行前确认航班与景区', '环岛路骑行注意租车押金与还车点'],
    大理: ['高原紫外线强，注意防晒和早晚温差', '洱海环湖路程长，建议分段游玩', '苍山索道受天气影响可能停运，出发前查询', '古镇周边停车紧张，短途建议步行或包车'],
    青岛: ['海边风大，带一件防风外套', '啤酒博物馆、海军博物馆需预约，注意闭馆日', '夏季浴场人流量大，留意安全提示', '老城区坡路多，打车短途比步行更省力'],
    上海: ['夏季闷热多阵雨，随身带伞', '上海博物馆、上海中心需预约购票，周一闭馆日较多', '外滩周末人流量大，建议错峰前往', '地铁网络发达，市内出行优先地铁'],
    北京: ['春秋气候舒适，冬季干冷、夏季暴晒', '故宫、国博等热门场馆需提前预约，周一闭馆', '热门景点安检严格，建议提前到场', '地铁网络覆盖广，高峰时段比打车更稳'],
    广州: ['湿热多雨，出门带伞并做好防晒', '早茶老字号排队久，建议开市时段到店', '广州塔、圣心大教堂等热门点错峰前往', '地铁最方便，打车避开早晚高峰'],
    深圳: ['夏季炎热，注意防晒补水', '世界之窗等主题公园建议提前购票', '深圳湾日落时分人流量大，早去占位', '地铁网络发达，短途步行反而更顺'],
    苏州: ['梅雨季潮湿，建议备伞和防滑鞋', '园林限流需提前预约，旺季尽量早到', '平江路、山塘街晚间人多，错峰体验更好', '市内打车加步行，去古镇优先地铁/公交'],
    南京: ['夏季炎热、冬季湿冷，按季节备衣', '中山陵、南京博物院周一闭馆，需预约', '梧桐大道春秋最美，适合散步', '地铁直达主要景区，出行优先地铁'],
    长沙: ['夏季闷热，注意防暑补水', '网红餐厅排队久，建议错峰取号', '橘子洲周末人流大，可坐观光车', '地铁加打车组合，夜宵街区步行更顺'],
    武汉: ['夏季炎热潮湿，随身带伞', '省博、黄鹤楼需预约，周一闭馆较多', '东湖绿道适合骑行，周末人多', '长江大桥步行注意车流与安全'],
    桂林: ['雨季集中在 4-6 月，带好雨具', '漓江竹筏受天气影响，出发前确认开放', '阳朔旺季住宿紧张，建议提前预订', '市区到阳朔可乘高铁或大巴，方便'],
    丽江: ['高原紫外线强，注意防晒和早晚温差', '玉龙雪山需提前购票，备好氧气', '古城石板路拖行李不便，轻装出行', '拉市海游玩注意选择正规商家'],
    三亚: ['全年炎热，防晒必备', '冬季旺季住宿机票价格高，建议提前订', '蜈支洲岛船票需预约，早班次人少', '海鲜加工注意确认称重与价格'],
    哈尔滨: ['冬季严寒，务必保暖防滑', '冰雪大世界夜间最出片但体感很冷', '中央大街人多，注意保管随身物品', '冬季路滑，穿防滑鞋更稳妥'],
    洛阳: ['春秋最舒适，牡丹季人流量大', '龙门石窟、白马寺可提前购票', '老君山离市区远，建议预留一整天', '水席老店错峰用餐体验更好'],
    默认: ['出发前查询当地 7 天天气，按季节调整衣物', '热门景点建议提前 3-7 天预约，周一注意博物馆闭馆', '景区开放时间可能临时调整，出发前以官方公告为准', '市内交通建议地铁/公交与打车组合，高峰期预留时间']
  };

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

  const BASE_CITIES = [
    {
      name: '成都',
      region: '四川',
      tagline: '巴适慢生活',
      image: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=900&q=80',
      areas: ['玉林路', '宽窄巷子', '东郊记忆', '人民公园', '建设路'],
      food: [
        { name: '玉林路老火锅', area: '玉林路', cost: 160, duration: 120, desc: '牛油锅底配毛肚、鸭肠，本地人的夜宵首选。', tags: ['地道', '麻辣'], slot: 'dinner' },
        { name: '建设路小吃街', area: '建设路', cost: 60, duration: 90, desc: '甜水面、蛋烘糕、糖油果子，一路吃过去。', tags: ['小吃', '便宜'], slot: 'lunch' },
        { name: '鹤鸣茶社盖碗茶', area: '人民公园', cost: 35, duration: 120, desc: '竹椅、盖碗茶，看采耳和棋牌，体验成都式放空。', tags: ['茶馆', '休闲'], slot: 'afternoon' },
        { name: '陈麻婆豆腐', area: '宽窄巷子', cost: 90, duration: 90, desc: '麻辣豆腐配蒜苗，川菜下饭担当。', tags: ['川菜', '经典'], slot: 'lunch' },
        { name: '锦里夜宵', area: '宽窄巷子', cost: 80, duration: 100, desc: '灯笼亮起来后的锦里，小吃与夜色都很热闹。', tags: ['夜景', '小吃'], slot: 'evening' }
      ],
      sight: [
        { name: '武侯祠', area: '玉林路', cost: 50, duration: 120, desc: '三国文化核心地标，红墙竹影很有古意。', tags: ['历史', '门票'], slot: 'any' },
        { name: '成都博物馆', area: '人民公园', cost: 0, duration: 150, desc: '免费看成都通史与皮影展，预约即可进入。', tags: ['免费', '室内'], slot: 'any' },
        { name: '都江堰景区', area: '玉林路', cost: 80, duration: 240, desc: '千年水利工程，鱼嘴分水与安澜索桥值得走一遍。', tags: ['世界遗产', '户外'], slot: 'any' },
        { name: '大熊猫繁育基地', area: '东郊记忆', cost: 55, duration: 180, desc: '赶早去看熊猫吃竹子，上午最活跃。', tags: ['动物', '亲子'], slot: 'any' },
        { name: '宽窄巷子', area: '宽窄巷子', cost: 0, duration: 120, desc: '青砖老巷与文创小店，适合慢慢逛。', tags: ['老街', '免费'], slot: 'any' }
      ],
      photo: [
        { name: '东郊记忆工业风', area: '东郊记忆', cost: 0, duration: 120, desc: '老厂房、涂鸦与红砖烟囱，出片率很高。', tags: ['工业风', '免费'], slot: 'any' },
        { name: '九眼桥夜景', area: '玉林路', cost: 0, duration: 90, desc: '河岸酒吧街灯光倒映水面，夜拍氛围感十足。', tags: ['夜景', '免费'], slot: 'evening' },
        { name: '太古里街拍', area: '宽窄巷子', cost: 0, duration: 90, desc: '现代建筑与川西街巷交错，适合人像扫街。', tags: ['街拍', '免费'], slot: 'any' },
        { name: '锦里灯笼夜拍', area: '宽窄巷子', cost: 0, duration: 90, desc: '红灯笼串起老街轮廓，夜晚格外上镜。', tags: ['夜景', '免费'], slot: 'evening' }
      ]
    },
    {
      name: '杭州',
      region: '浙江',
      tagline: '山水与茶香',
      image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=900&q=80',
      areas: ['西湖东线', '西湖西线', '灵隐', '运河', '龙井'],
      food: [
        { name: '楼外楼西湖醋鱼', area: '西湖东线', cost: 180, duration: 90, desc: '西湖边的老字号，醋鱼酸甜开胃。', tags: ['老字号', '杭帮菜'], slot: 'lunch' },
        { name: '河坊街小吃', area: '运河', cost: 45, duration: 90, desc: '定胜糕、葱包桧、龙须糖一路吃。', tags: ['小吃', '老街'], slot: 'afternoon' },
        { name: '龙井村农家菜', area: '龙井', cost: 120, duration: 120, desc: '茶园边的本帮农家菜，配一杯龙井。', tags: ['农家菜', '龙井'], slot: 'lunch' },
        { name: '知味观小笼', area: '西湖东线', cost: 35, duration: 60, desc: '皮薄汁多的鲜肉小笼，配一碗小馄饨。', tags: ['早餐', '点心'], slot: 'morning' },
        { name: '运河夜宵', area: '运河', cost: 70, duration: 90, desc: '桥西直街的夜宵档口，烟火气很足。', tags: ['夜宵'], slot: 'evening' }
      ],
      sight: [
        { name: '断桥白堤', area: '西湖东线', cost: 0, duration: 120, desc: '从断桥沿白堤走到孤山，看西湖开篇。', tags: ['经典', '免费'], slot: 'any' },
        { name: '雷峰塔', area: '西湖西线', cost: 40, duration: 90, desc: '登塔俯瞰西湖与城市天际线。', tags: ['地标', '门票'], slot: 'any' },
        { name: '灵隐寺', area: '灵隐', cost: 75, duration: 180, desc: '千年古刹与飞来峰造像，清晨去人少。', tags: ['寺庙', '历史'], slot: 'any' },
        { name: '西溪湿地', area: '西湖西线', cost: 80, duration: 180, desc: '坐摇橹船穿行芦苇荡，城市里的野趣。', tags: ['湿地', '游船'], slot: 'any' },
        { name: '中国茶叶博物馆', area: '龙井', cost: 0, duration: 120, desc: '了解龙井茶史，出来就是茶园。', tags: ['博物馆', '免费'], slot: 'any' }
      ],
      photo: [
        { name: '龙井茶园', area: '龙井', cost: 0, duration: 90, desc: '清晨薄雾里的茶山梯田，非常出片。', tags: ['茶园', '免费'], slot: 'morning' },
        { name: '小河直街', area: '运河', cost: 0, duration: 120, desc: '白墙黛瓦与小河拱桥，江南味十足。', tags: ['老街', '免费'], slot: 'afternoon' },
        { name: '湖滨夜景', area: '西湖东线', cost: 0, duration: 90, desc: '湖滨步行街看西湖灯光与城市倒影。', tags: ['夜景', '免费'], slot: 'evening' },
        { name: '九溪烟树', area: '龙井', cost: 0, duration: 120, desc: '溪水、枫树与石径，雨天更有烟树感。', tags: ['自然', '免费'], slot: 'afternoon' }
      ]
    },
    {
      name: '重庆',
      region: '山城',
      tagline: '魔幻立体城市',
      image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=900&q=80',
      areas: ['渝中半岛', '南滨路', '磁器口', '南山', '观音桥'],
      food: [
        { name: '洞子老火锅', area: '渝中半岛', cost: 120, duration: 120, desc: '藏在防空洞里的牛油火锅，越煮越香。', tags: ['火锅', '地道'], slot: 'dinner' },
        { name: '板凳小面', area: '渝中半岛', cost: 15, duration: 45, desc: '豌杂面配煎蛋，重庆人一天的开始。', tags: ['早餐', '便宜'], slot: 'morning' },
        { name: '观音桥好吃街', area: '观音桥', cost: 60, duration: 90, desc: '酸辣粉、冰粉、烤脑花一站吃齐。', tags: ['小吃', '实惠'], slot: 'lunch' },
        { name: '南山枇杷园火锅', area: '南山', cost: 140, duration: 150, desc: '半山腰的枇杷园火锅，边吃边看夜景。', tags: ['火锅', '夜景'], slot: 'dinner' },
        { name: '磁器口陈麻花', area: '磁器口', cost: 45, duration: 60, desc: '现炸麻花配毛血旺，老镇小吃代表。', tags: ['小吃', '古镇'], slot: 'afternoon' }
      ],
      sight: [
        { name: '洪崖洞', area: '渝中半岛', cost: 0, duration: 150, desc: '依山而建的吊脚楼，白天晚上两种味道。', tags: ['地标', '免费'], slot: 'any' },
        { name: '长江索道', area: '渝中半岛', cost: 30, duration: 60, desc: '空中横跨长江，感受立体山城。', tags: ['交通', '体验'], slot: 'any' },
        { name: '磁器口古镇', area: '磁器口', cost: 0, duration: 150, desc: '石板路与茶馆码头，市井气息浓厚。', tags: ['古镇', '免费'], slot: 'any' },
        { name: '三峡博物馆', area: '渝中半岛', cost: 0, duration: 150, desc: '看三峡文物与重庆历史，室内避暑好去处。', tags: ['博物馆', '免费'], slot: 'any' },
        { name: '山城步道', area: '南滨路', cost: 0, duration: 120, desc: '沿崖壁步道穿行老城，看见立体重庆。', tags: ['徒步', '免费'], slot: 'any' }
      ],
      photo: [
        { name: '南山一棵树观景台', area: '南山', cost: 30, duration: 90, desc: '经典城市观景位，日落后的万家灯火。', tags: ['夜景', '观景台'], slot: 'evening' },
        { name: '李子坝轻轨穿楼', area: '渝中半岛', cost: 0, duration: 60, desc: '看轻轨从楼里穿出，山城魔幻名场面。', tags: ['打卡', '免费'], slot: 'morning' },
        { name: '鹅岭二厂', area: '南滨路', cost: 0, duration: 120, desc: '旧印刷厂改造的文创园，工业风出片。', tags: ['文创', '免费'], slot: 'afternoon' },
        { name: '黄桷坪涂鸦街', area: '观音桥', cost: 0, duration: 90, desc: '一整条街的涂鸦艺术，色彩很丰富。', tags: ['涂鸦', '免费'], slot: 'afternoon' }
      ]
    },
    {
      name: '西安',
      region: '陕西',
      tagline: '十三朝古都',
      image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=900&q=80',
      areas: ['城墙·南门', '大雁塔', '碑林', '临潼', '回民街'],
      food: [
        { name: '回民街牛羊肉泡馍', area: '回民街', cost: 45, duration: 90, desc: '亲手掰馍再交给店家煮，越掰越香。', tags: ['泡馍', '清真'], slot: 'lunch' },
        { name: '洒金桥胡辣汤', area: '回民街', cost: 15, duration: 45, desc: '肉丸胡辣汤配坨坨馍，清晨最治愈。', tags: ['早餐', '便宜'], slot: 'morning' },
        { name: 'biangbiang 面', area: '回民街', cost: 30, duration: 60, desc: '裤带宽的面条配油泼辣子，过瘾。', tags: ['面食', '辣'], slot: 'lunch' },
        { name: '大唐不夜城小吃', area: '大雁塔', cost: 80, duration: 100, desc: '灯火通明的步行街，边逛边吃。', tags: ['夜市', '夜景'], slot: 'evening' },
        { name: '城墙根烧烤', area: '城墙·南门', cost: 90, duration: 120, desc: '傍晚城墙下的烤肉摊，本地夜生活。', tags: ['烧烤', '夜宵'], slot: 'dinner' }
      ],
      sight: [
        { name: '兵马俑', area: '临潼', cost: 120, duration: 240, desc: '看秦代军阵，建议请讲解或租导览器。', tags: ['世界遗产', '门票'], slot: 'any' },
        { name: '陕西历史博物馆', area: '碑林', cost: 0, duration: 180, desc: '周秦汉唐文物精华，记得提前预约。', tags: ['博物馆', '免费'], slot: 'any' },
        { name: '古城墙', area: '城墙·南门', cost: 54, duration: 150, desc: '租辆单车骑一圈，俯瞰老城布局。', tags: ['城墙', '骑行'], slot: 'any' },
        { name: '大雁塔', area: '大雁塔', cost: 40, duration: 120, desc: '登塔远望，塔前广场是城市中轴。', tags: ['古塔', '门票'], slot: 'any' },
        { name: '碑林博物馆', area: '碑林', cost: 50, duration: 120, desc: '历代名碑石刻，书法爱好者天堂。', tags: ['书法', '门票'], slot: 'any' }
      ],
      photo: [
        { name: '大唐不夜城汉服', area: '大雁塔', cost: 0, duration: 120, desc: '换上汉服拍夜景，一秒穿越盛唐。', tags: ['汉服', '夜景'], slot: 'evening' },
        { name: '永兴坊', area: '城墙·南门', cost: 0, duration: 90, desc: '摔碗酒与仿古街景，民俗感很强。', tags: ['民俗', '免费'], slot: 'afternoon' },
        { name: '小雁塔', area: '碑林', cost: 0, duration: 90, desc: '晨光里的古塔与庭院，比大雁塔更安静。', tags: ['古塔', '免费'], slot: 'morning' },
        { name: '城墙日落', area: '城墙·南门', cost: 0, duration: 90, desc: '日落时分的光线最适合拍城楼剪影。', tags: ['日落', '免费'], slot: 'evening' }
      ]
    },
    {
      name: '厦门',
      region: '福建',
      tagline: '海风与小岛',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80',
      areas: ['鼓浪屿', '沙坡尾', '环岛路', '中山路', '集美'],
      food: [
        { name: '沙茶面', area: '沙坡尾', cost: 30, duration: 45, desc: '浓郁沙茶汤底，加虾仁和豆腐泡。', tags: ['早餐', '闽南'], slot: 'morning' },
        { name: '鼓浪屿海蛎煎', area: '鼓浪屿', cost: 40, duration: 60, desc: '街边现煎，配甜辣酱最好吃。', tags: ['小吃', '鼓浪屿'], slot: 'afternoon' },
        { name: '中山路花生汤', area: '中山路', cost: 35, duration: 60, desc: '花生汤配油条，老厦门的甜。', tags: ['甜品', '老街'], slot: 'afternoon' },
        { name: '曾厝垵海鲜大排档', area: '环岛路', cost: 150, duration: 120, desc: '现捞海鲜配冰啤，海边夜晚标配。', tags: ['海鲜', '夜宵'], slot: 'dinner' },
        { name: '姜母鸭', area: '中山路', cost: 85, duration: 90, desc: '姜香浓郁的一锅鸭，暖胃又下饭。', tags: ['闽菜', '滋补'], slot: 'lunch' }
      ],
      sight: [
        { name: '鼓浪屿日光岩', area: '鼓浪屿', cost: 90, duration: 180, desc: '登顶看小岛红屋顶与海面。', tags: ['海岛', '门票'], slot: 'any' },
        { name: '南普陀寺', area: '沙坡尾', cost: 0, duration: 90, desc: '香火旺盛的千年古寺，紧邻厦大。', tags: ['寺庙', '免费'], slot: 'any' },
        { name: '厦门大学', area: '沙坡尾', cost: 0, duration: 120, desc: '校园与海相接，需提前预约参观。', tags: ['校园', '预约'], slot: 'any' },
        { name: '环岛路骑行', area: '环岛路', cost: 0, duration: 150, desc: '租一辆单车沿海骑，海风很舒服。', tags: ['骑行', '免费'], slot: 'any' },
        { name: '集美学村', area: '集美', cost: 0, duration: 120, desc: '嘉庚建筑群，红砖骑楼很有味道。', tags: ['建筑', '免费'], slot: 'any' }
      ],
      photo: [
        { name: '沙坡尾艺术西区', area: '沙坡尾', cost: 0, duration: 120, desc: '老渔港改造的文创街区，色彩缤纷。', tags: ['文创', '免费'], slot: 'afternoon' },
        { name: '演武大桥日落', area: '环岛路', cost: 0, duration: 90, desc: '桥上观景台看日落，海面一片金黄。', tags: ['日落', '免费'], slot: 'evening' },
        { name: '白城沙滩夜景', area: '环岛路', cost: 0, duration: 60, desc: '沙滩、栈道与城市灯光一起入镜。', tags: ['夜景', '免费'], slot: 'evening' },
        { name: '山海健康步道', area: '集美', cost: 0, duration: 120, desc: '穿行山海的空中步道，视野极好。', tags: ['步道', '免费'], slot: 'morning' }
      ]
    },
    {
      name: '大理',
      region: '云南',
      tagline: '苍山洱海间',
      image: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=900&q=80',
      areas: ['大理古城', '洱海西岸', '双廊', '喜洲', '苍山'],
      food: [
        { name: '喜洲粑粑', area: '喜洲', cost: 10, duration: 45, desc: '炭火烤的破酥粑粑，甜咸都好吃。', tags: ['早餐', '小吃'], slot: 'morning' },
        { name: '白族砂锅鱼', area: '大理古城', cost: 120, duration: 90, desc: '洱海鱼配酸木瓜，酸辣鲜香。', tags: ['白族菜', '特色'], slot: 'lunch' },
        { name: '乳扇与烤饵块', area: '大理古城', cost: 30, duration: 60, desc: '古城街头的乳扇烤得微焦，蘸糖吃。', tags: ['小吃', '大理'], slot: 'afternoon' },
        { name: '洱海边咖啡馆', area: '洱海西岸', cost: 55, duration: 90, desc: '面朝洱海发呆，喝杯云南小粒咖啡。', tags: ['咖啡', '休闲'], slot: 'afternoon' },
        { name: '菌子火锅', area: '大理古城', cost: 130, duration: 120, desc: '雨季限定菌子锅，鲜到掉眉毛。', tags: ['火锅', '山珍'], slot: 'dinner' }
      ],
      sight: [
        { name: '洱海生态廊道', area: '洱海西岸', cost: 0, duration: 180, desc: '沿湖骑行或步行，看海鸥与苍山倒影。', tags: ['洱海', '免费'], slot: 'any' },
        { name: '苍山洗马潭索道', area: '苍山', cost: 120, duration: 240, desc: '乘索道上苍山，洗马潭湖面如镜。', tags: ['山景', '门票'], slot: 'any' },
        { name: '崇圣寺三塔', area: '大理古城', cost: 75, duration: 150, desc: '三塔与苍山同框，是大理名片。', tags: ['古塔', '门票'], slot: 'any' },
        { name: '喜洲古镇', area: '喜洲', cost: 0, duration: 120, desc: '白族民居与稻田，古朴安静。', tags: ['古镇', '免费'], slot: 'any' },
        { name: '双廊古镇', area: '双廊', cost: 0, duration: 120, desc: '临湖小镇，南诏风情岛就在眼前。', tags: ['古镇', '免费'], slot: 'any' }
      ],
      photo: [
        { name: '龙龛码头日出', area: '洱海西岸', cost: 0, duration: 60, desc: '洱海东边日出，码头晨光很柔。', tags: ['日出', '免费'], slot: 'morning' },
        { name: '海舌公园', area: '喜洲', cost: 0, duration: 90, desc: '伸入洱海的狭长沙洲，拍照绝佳。', tags: ['洱海', '免费'], slot: 'morning' },
        { name: '理想邦', area: '双廊', cost: 0, duration: 120, desc: '白墙蓝顶的建筑群，被称为小圣托里尼。', tags: ['建筑', '免费'], slot: 'afternoon' },
        { name: '小普陀日落', area: '双廊', cost: 0, duration: 90, desc: '海中小岛配落日，很有画意。', tags: ['日落', '免费'], slot: 'evening' }
      ]
    },
    {
      name: '青岛',
      region: '山东',
      tagline: '红瓦绿树碧海',
      image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=80',
      areas: ['老城·栈桥', '八大关', '奥帆中心', '崂山', '台东'],
      food: [
        { name: '甜沫与锅贴', area: '老城·栈桥', cost: 25, duration: 45, desc: '青岛早餐标配，一碗甜沫配猪肉锅贴。', tags: ['早餐', '本地'], slot: 'morning' },
        { name: '劈柴院豆腐脑', area: '老城·栈桥', cost: 20, duration: 45, desc: '老城小吃街的豆腐脑与烤肉串。', tags: ['小吃', '老街'], slot: 'morning' },
        { name: '台东夜市', area: '台东', cost: 70, duration: 100, desc: '海鲜烧烤、炸串、啤酒一站式。', tags: ['夜市', '海鲜'], slot: 'evening' },
        { name: '啤酒屋海鲜', area: '台东', cost: 150, duration: 120, desc: '拎着海鲜去啤酒屋加工，配原浆生啤。', tags: ['海鲜', '啤酒'], slot: 'lunch' },
        { name: '青岛啤酒博物馆', area: '台东', cost: 60, duration: 90, desc: '参观老厂房，最后喝一杯原浆。', tags: ['啤酒', '体验'], slot: 'afternoon' }
      ],
      sight: [
        { name: '栈桥', area: '老城·栈桥', cost: 0, duration: 90, desc: '伸入海中的回澜阁，青岛地标。', tags: ['地标', '免费'], slot: 'any' },
        { name: '八大关', area: '八大关', cost: 0, duration: 150, desc: '各国风格别墅与林荫道，适合散步。', tags: ['建筑', '免费'], slot: 'any' },
        { name: '崂山太清宫', area: '崂山', cost: 130, duration: 300, desc: '山海间的道教名山，索道加徒步。', tags: ['山海', '门票'], slot: 'any' },
        { name: '小鱼山公园', area: '老城·栈桥', cost: 15, duration: 90, desc: '登顶看老城红瓦绿树与海湾。', tags: ['公园', '门票'], slot: 'any' },
        { name: '奥帆中心', area: '奥帆中心', cost: 0, duration: 120, desc: '帆船码头与情人坝，海风很舒服。', tags: ['海边', '免费'], slot: 'any' }
      ],
      photo: [
        { name: '信号山日落', area: '老城·栈桥', cost: 15, duration: 90, desc: '红瓦屋顶在夕阳里发光，经典机位。', tags: ['日落', '门票'], slot: 'evening' },
        { name: '小麦岛公园', area: '奥帆中心', cost: 0, duration: 120, desc: '海堤与草坪伸进海里，非常出片。', tags: ['海岛', '免费'], slot: 'afternoon' },
        { name: '大学路网红墙', area: '八大关', cost: 0, duration: 60, desc: '红墙转角，随手一拍就是杂志感。', tags: ['街拍', '免费'], slot: 'morning' },
        { name: '西海岸日落大道', area: '奥帆中心', cost: 0, duration: 90, desc: '宽阔海面配日落大道，日落绝佳。', tags: ['日落', '免费'], slot: 'evening' }
      ]
    },
    {
      name: '上海',
      region: '魔都',
      tagline: '繁华与梧桐',
      image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=900&q=80',
      areas: ['外滩', '武康路', '豫园', '陆家嘴', '徐汇滨江'],
      food: [
        { name: '南翔小笼', area: '豫园', cost: 45, duration: 60, desc: '豫园旁的老字号，皮薄汤多。', tags: ['早餐', '点心'], slot: 'morning' },
        { name: '大壶春生煎', area: '外滩', cost: 30, duration: 45, desc: '全发面生煎，底脆肉香。', tags: ['生煎', '早餐'], slot: 'morning' },
        { name: '本帮红烧肉', area: '豫园', cost: 150, duration: 90, desc: '浓油赤酱的经典本帮菜，配一碗米饭。', tags: ['本帮菜', '经典'], slot: 'lunch' },
        { name: '云南路小吃街', area: '外滩', cost: 70, duration: 90, desc: '老上海小吃一条街，大排面加炸猪排。', tags: ['小吃', '老街'], slot: 'lunch' },
        { name: '武康路咖啡馆', area: '武康路', cost: 60, duration: 90, desc: '梧桐树下的咖啡馆，适合歇脚。', tags: ['咖啡', '街区'], slot: 'afternoon' }
      ],
      sight: [
        { name: '上海博物馆', area: '人民广场', cost: 0, duration: 180, desc: '青铜器与书画馆藏一流，需预约。', tags: ['博物馆', '免费'], slot: 'any' },
        { name: '豫园', area: '豫园', cost: 40, duration: 120, desc: '江南园林与老城厢，一步一景。', tags: ['园林', '门票'], slot: 'any' },
        { name: '外滩万国建筑', area: '外滩', cost: 0, duration: 120, desc: '沿江看历史建筑群，白天更清楚。', tags: ['建筑', '免费'], slot: 'any' },
        { name: '上海中心观光厅', area: '陆家嘴', cost: 180, duration: 90, desc: '登上海之巅看全城，晴天才值得。', tags: ['地标', '门票'], slot: 'any' },
        { name: '思南公馆', area: '武康路', cost: 0, duration: 90, desc: '花园洋房街区，梧桐与老建筑。', tags: ['街区', '免费'], slot: 'any' }
      ],
      photo: [
        { name: '外滩夜景', area: '外滩', cost: 0, duration: 90, desc: '浦江两岸灯光亮起，城市名片机位。', tags: ['夜景', '免费'], slot: 'evening' },
        { name: '武康大楼', area: '武康路', cost: 0, duration: 60, desc: '经典街角建筑，人少时最好拍。', tags: ['街拍', '免费'], slot: 'morning' },
        { name: '徐汇滨江', area: '徐汇滨江', cost: 0, duration: 120, desc: '开阔江景与工业遗存，傍晚光线很美。', tags: ['江景', '免费'], slot: 'afternoon' },
        { name: '田子坊', area: '武康路', cost: 0, duration: 120, desc: '弄堂里的创意小店与涂鸦。', tags: ['弄堂', '免费'], slot: 'afternoon' }
      ]
    }
  ];

  const EXTRA_CITIES = (window.LUSHU_CITIES || []);
  const CITIES = [...BASE_CITIES, ...EXTRA_CITIES];
  const AREA_COORDS = (window.LUSHU_AREA_COORDS || {});
  const CITY_CENTERS = (window.LUSHU_CITY_CENTERS || {});

  const LODGING_POOL = (window.LUSHU_LODGING || {});

  const GENERIC_LODGING = [
    { name: '市中心舒适酒店', area: '市中心', type: '酒店', price: 380, desc: '市中心位置，吃饭逛街都方便。', tags: ['交通便利'] },
    { name: '老城区特色民宿', area: '老城区', type: '民宿', price: 320, desc: '老街巷里的民宿，体验当地生活。', tags: ['特色'] },
    { name: '滨江路景观酒店', area: '滨江路', type: '酒店', price: 460, desc: '沿江景观房，夜景不错。', tags: ['景观'] }
  ];

  const $ = selector => document.querySelector(selector);

  const BACKEND_URL = (window.LUSHU_BACKEND_URL || '').replace(/\/+$/, '');

  function getToken() {
    try {
      return localStorage.getItem(STORAGE.token) || '';
    } catch (err) {
      return '';
    }
  }

  function setToken(token) {
    try {
      if (token) localStorage.setItem(STORAGE.token, token);
      else localStorage.removeItem(STORAGE.token);
    } catch (err) {
      /* 忽略 */
    }
  }

  async function apiFetch(path, options = {}) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), options.timeoutMs || 8000);
    try {
      const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
      const token = getToken();
      if (token) headers.Authorization = 'Bearer ' + token;
      const res = await fetch(BACKEND_URL + path, {
        ...options,
        headers,
        credentials: 'include',
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

  async function cloudSyncPlans() {
    if (!currentUser()) return;
    try {
      const summaries = await apiFetch('/api/plans');
      const cloudPlans = [];
      const user = currentUser();
      for (const summary of summaries) {
        try {
          const plan = await apiFetch('/api/plans/' + encodeURIComponent(summary.id));
          if (plan && plan.days && plan.days.length) {
            cloudPlans.push({ id: plan.id, createdAt: plan.createdAt || '', owner: user, plan });
          }
        } catch (err) {
          /* 单条失败不阻塞整体 */
        }
      }
      const local = getSavedPlans();
      const byId = new Map();
      local.forEach(item => byId.set(item.id, item));
      cloudPlans.forEach(item => {
        const existing = byId.get(item.id);
        if (!existing || String(item.plan.updatedAt || '') > String(existing.plan.updatedAt || '')) {
          byId.set(item.id, item);
        }
      });
        const merged = [...byId.values()];
        merged.sort((a, b) => String(b.plan.updatedAt || b.createdAt || '').localeCompare(String(a.plan.updatedAt || a.createdAt || '')));
        const raw = localStorage.getItem(STORAGE.plans);
        const all = raw ? JSON.parse(raw) : [];
        const others = Array.isArray(all) ? all.filter(item => item.owner && item.owner !== user) : [];
        safeSetItem(STORAGE.plans, [...merged.slice(0, 8), ...others].slice(0, 20));
        updateSavedBadge();
    } catch (err) {
      /* 后端不可用时保留本地数据 */
    }
  }

  async function cloudUpsertPlan(plan) {
    if (!currentUser() || !plan) return;
    try {
      await apiFetch('/api/plans', { method: 'POST', body: JSON.stringify({ plan }) });
    } catch (err) {
      /* 云端同步失败时本地仍然保留 */
    }
  }

  async function cloudDeletePlan(id) {
    if (!currentUser() || !id) return;
    try {
      await apiFetch('/api/plans/' + encodeURIComponent(id), { method: 'DELETE' });
    } catch (err) {
      /* 忽略 */
    }
  }

  function pickLodging(city, budget, days) {
    const pool = (city && LODGING_POOL[city.name]) || GENERIC_LODGING;
    const dailyBudget = Math.max(150, Math.round(budget / Math.max(1, days)));
    const preferred = Math.min(dailyBudget * 0.72, 650);
    const scored = pool.map(item => ({
      item,
      score: Math.abs(item.price - preferred) + Math.random() * 80
    })).sort((a, b) => a.score - b.score);
    return { ...scored[0].item };
  }

  function lodgingForPlan(plan) {
    if (plan && plan.lodging && plan.lodging.name) return plan.lodging;
    const city = plan ? cityFor(plan) : null;
    const pool = (city && LODGING_POOL[city.name]) || GENERIC_LODGING;
    return { ...pool[0], price: Number(pool[0].price) || 380 };
  }

  function lodgingDisplayName(stayInfo) {
    return stayInfo && stayInfo.area ? `${stayInfo.area}附近` : '住宿附近';
  }

  function orderAreasByDistance(city, startArea) {
    const areas = city.areas && city.areas.length
      ? city.areas.map(item => typeof item === 'object' ? item.name : item)
      : ['市中心', '老城区', '滨江路', '文化区', '艺术区'];
    if (!startArea || !areas.includes(startArea)) return areas;
    const rest = areas.filter(area => area !== startArea);
    rest.sort((a, b) => transferMinutes(city, startArea, a) - transferMinutes(city, startArea, b));
    return [startArea, ...rest];
  }

  function switchLodging() {
    if (!currentPlan) return;
    const city = cityFor(currentPlan);
    const pool = (city && LODGING_POOL[city.name]) || GENERIC_LODGING;
    const stayInfo = lodgingForPlan(currentPlan);
    const index = pool.findIndex(item => item.name === stayInfo.name);
    const next = pool[(index + 1) % pool.length];
    const form = formFromPlan(currentPlan);
    pushContext(`更换住宿：${lodgingDisplayName(stayInfo)} → ${lodgingDisplayName(next)}`);
    currentPlan = generateItinerary(form, next);
    renderResult(currentPlan, { preserveOpen: true, scroll: false });
    persistLastPlan(currentPlan);
    showToast(`已更换住宿：${lodgingDisplayName(next)}，行程已重新规划`);
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
    if (city.center) return { lat: city.center[0], lng: city.center[1] };
    const known = CITY_CENTERS[city.name];
    if (known) return { lat: known[0], lng: known[1] };
    const seed = hashString(city.name || '目的地');
    return { lat: 21 + (seed % 150) / 10, lng: 97 + ((seed >> 3) % 200) / 10 };
  }

  function areaCoord(city, area) {
    if (!area) return null;
    const cityMap = AREA_COORDS[city.name] || {};
    const direct = cityMap[area];
    if (direct) return { lat: direct[0], lng: direct[1] };
    if (Array.isArray(city.areas)) {
      const found = city.areas.find(item => typeof item === 'object' && item.name === area);
      if (found) return { lat: found.lat, lng: found.lng };
    }
    const center = cityCenter(city);
    if (!center) return null;
    const offsets = {
      '市中心': [0, 0],
      '老城区': [0.012, 0.010],
      '滨江路': [0.006, -0.014],
      '文化区': [-0.012, 0.006],
      '艺术区': [0.008, -0.008],
      '沿途': [0, 0],
      '住宿': [0.004, -0.004],
      '市内': [0, 0]
    };
    const offset = offsets[area] || [0, 0];
    return { lat: center.lat + offset[0], lng: center.lng + offset[1] };
  }

  function itemCoord(plan, item) {
    if (!item || item.cat === 'transport') return null;
    const city = cityFor(plan);
    if (!city) return null;
    const base = areaCoord(city, item.area);
    if (!base) return null;
    const seed = hashString(item.name + '|' + item.area);
    const jitter = 0.0008;
    return {
      lat: base.lat + ((seed % 9) - 4) * jitter,
      lng: base.lng + ((seed % 13) - 6) * jitter
    };
  }

  function transferMinutes(city, areaA, areaB) {
    if (!areaA || !areaB || areaA === areaB || areaA === '沿途' || areaB === '沿途') {
      return 10;
    }
    const a = areaCoord(city, areaA);
    const b = areaCoord(city, areaB);
    if (!a || !b) return 20;
    const km = geoDistance(a, b);
    if (km <= 1.2) return Math.max(8, Math.round(km / 0.075) + 4);
    return Math.round((km - 1.2) / 0.5) + 21;
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function fmtMoney(value) {
    return '¥' + Number(value || 0).toLocaleString('zh-CN');
  }

  function categoryKey(pref) {
    const meta = PREF_META[pref];
    return meta ? meta.cats[0] : null;
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

  const PACE_TIMES = {
    '早起休闲': { morning: '07:30 - 10:30', lunch: '11:00 - 12:30', afternoon: '13:00 - 16:30', dinner: '17:30 - 19:00', evening: '20:00 - 21:30' },
    '深度打卡': { morning: '08:30 - 11:30', lunch: '11:30 - 13:00', afternoon: '13:30 - 17:30', dinner: '18:00 - 19:30', evening: '20:00 - 22:30' },
    '懒人慢游': { morning: '09:30 - 12:00', lunch: '12:00 - 13:30', afternoon: '14:00 - 18:00', dinner: '18:30 - 20:00' }
  };

  function buildDay(city, dayIndex, days, prefs, target, used, options = {}) {
    const people = options.people || 2;
    const pace = options.pace || '深度打卡';
    const crowd = options.crowd || '情侣';
    const areas = options.areaOrder && options.areaOrder.length
      ? options.areaOrder
      : (city.areas && city.areas.length
        ? city.areas.map(item => typeof item === 'object' ? item.name : item)
        : ['市中心']);
    const area = areas[dayIndex % areas.length];
    const prefCats = prefs.map(categoryKey).filter(Boolean);
    if (crowd === '徒步驴友' && !prefCats.includes('sight')) prefCats.push('sight');
    const theme = dayIndex === 0
      ? '初见城市'
      : (days > 1 && dayIndex === days - 1) ? '松弛收官' : THEMES[(dayIndex - 1) % THEMES.length];
    const timeMap = PACE_TIMES[pace] || PACE_TIMES['深度打卡'];
    let slots = SLOTS.slice();
    if (pace === '懒人慢游') slots = slots.filter(slot => slot.key !== 'evening');

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

      const rooms = crowd === '亲子' ? 2 : Math.max(1, Math.ceil(people / 2));
      const budgetLodging = Math.max(120, Math.min(Math.round(target * 0.45 / 10) * 10, Math.round(target * 0.3 * Math.min(rooms, 2) / 10) * 10));
      const lodging = options.lodging
        ? Math.max(120, Math.min(Math.round(options.lodging.price / 10) * 10, Math.round(target * 0.5 / 10) * 10))
        : budgetLodging;
    const baseTransport = Math.min(target * 0.18, Math.max(40, Math.round(target * 0.08 * Math.min(rooms, 1.6) / 10) * 10));
    const transport = crowd === '老年' ? Math.round(baseTransport * 1.4 / 10) * 10 : baseTransport;
    const activitiesBudget = Math.max(100, target - lodging - transport);
    scaleItemCosts(items, activitiesBudget);
    fitToBudget(items, target, city, used);
    const itemsCost = items.reduce((sum, item) => sum + item.cost, 0);
    const cost = itemsCost + lodging + transport;
    let transitMinutes = 0;
    let totalDistanceKm = 0;
    for (let i = 1; i < items.length; i++) {
      transitMinutes += transferMinutes(city, items[i - 1].area, items[i].area);
      const coordA = areaCoord(city, items[i - 1].area);
      const coordB = areaCoord(city, items[i].area);
      totalDistanceKm += geoDistance(coordA, coordB);
    }
    return {
      day: dayIndex + 1,
      theme,
      area,
      cost,
      items,
      lodging,
      transport,
      baseTransport,
      transitMinutes: Math.round(transitMinutes),
      totalDistanceKm: Math.round(totalDistanceKm * 10) / 10
    };
  }

  function generateItinerary(form, fixedLodging) {
    const destination = String(form.destination || '').trim();
    const days = form.days;
    const budget = form.budget;
    const prefs = form.prefs;
    const found = CITIES.find(city => city.name === destination);
    const city = found || {
      name: destination,
      region: '目的地',
      tagline: '等你探索',
      areas: ['市中心', '老城区', '滨江路', '文化区', '艺术区'],
      image: '',
      food: GENERIC_POOL.food,
      sight: GENERIC_POOL.sight,
      photo: GENERIC_POOL.photo
      };
      const targets = distributeBudget(budget, days);
      const used = new Set();
      const lodging = fixedLodging || pickLodging(city, budget, days);
      const areaOrder = orderAreasByDistance(city, lodging.area);
      const dayPlans = targets.map((target, index) => buildDay(city, index, days, prefs, target, used, {
        people: form.people,
        pace: form.pace,
        crowd: form.crowd,
        lodging,
        areaOrder
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
      crowd: form.crowd || '情侣',
      pace: form.pace || '深度打卡',
      lodging,
      title: `${form.destination} ${days}天`,
      prefs,
      city: { name: city.name, region: city.region, tagline: city.tagline, image: city.image },
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
    plan.context = contextHistory.slice();
    return dedupePlan(plan);
  }

  let currentPlan = null;
  let lastForm = null;
  let toastTimer = null;
  let isGenerating = false;
  let stopRequested = false;
  let contextHistory = [];
  let refreshTimer = null;
  let persistTimer = null;
  let adjustMode = 'destination';

  function renderInspiration() {
    const datalist = $('#cityOptions');
    datalist.innerHTML = CITIES.map(city => `<option value="${city.name}"></option>`).join('');
  }

  function itemTypeLabel(cat) {
    return {
      food: '用餐',
      photo: '打卡',
      sight: '景点',
      walk: '自由',
      transport: '交通',
      stay: '住宿'
    }[cat] || '项目';
  }

  function travelTipsHTML(plan) {
    const tips = DEST_TIPS[plan.destination] || DEST_TIPS['默认'];
    return `
      <p class="breakdown-title">出行贴士</p>
      <div class="tips-block">
        ${tips.map(tip => `
          <div class="tip-item">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.4 1 2.3h6c0-.9.4-1.8 1-2.3A7 7 0 0 0 12 2Z"/></svg>
            <span>${tip}</span>
          </div>`).join('')}
      </div>`;
  }

      function renderTopPlanning(plan) {
    const container = $('#topPlanning');
    if (!container) return;
    const framework = plan.framework || buildLocalFramework(plan);
    const transportPlans = (framework.transport && framework.transport.plans) || [];
    const lodgingAreas = framework.lodgingAreas || [];
    const foodList = framework.foodList || [];
    container.innerHTML = `
      <div class="tp-section tp-transport">
        <div class="tp-head">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h12a4 4 0 0 1 4 4v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"/><path d="M4 11h16M8 17v2M16 17v2"/></svg>
          <strong>往返城际交通</strong>
        </div>
        <div class="tp-body">
          ${transportPlans.map(p => `
            <div class="tp-transport-item">
              <div class="tp-item-head">
                <strong class="tp-transport-mode">${p.mode || '高铁'}</strong>
                ${p.isBackup ? '<span class="tp-badge is-backup">备选</span>' : '<span class="tp-badge">优先</span>'}
              </div>
              <div class="tp-meta">
                <span>抵达 ${p.arriveTime || '下午'}</span>
                <span>返程 ${p.departTime || '上午'}</span>
                <span>单程约 ${p.duration || '3-4 小时'}</span>
                <span>参考价 ${p.priceRange || '以平台为准'}</span>
              </div>
              <p>${p.reason || ''}</p>
            </div>`).join('')}
        </div>
        <p class="tp-disclaimer">班次、票价仅规划参考，请以官方购票平台实时信息为准。</p>
      </div>
      <div class="tp-section tp-lodging">
        <div class="tp-head">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 9v11M2 14h20v6M2 20h20M22 14V9a3 3 0 0 0-3-3H8v8"/><circle cx="6" cy="12" r="1"/></svg>
          <strong>住宿片区推荐</strong>
        </div>
        <div class="tp-body">
          ${lodgingAreas.map(a => `
            <div class="tp-lodging-item">
              <div class="tp-item-head">
                <strong>${a.name || '市中心'}</strong>
                <span>${a.priceRange || '以平台为准'}</span>
              </div>
              <p>${a.pros || ''}</p>
              ${a.cons ? `<p class="tp-cons">不足：${a.cons}</p>` : ''}
              <span class="tp-example">示例：${a.hotelExamples || '平台搜索'}</span>
            </div>`).join('')}
        </div>
        <p class="tp-disclaimer">酒店价格仅为规划参考，实际预订价格请以酒店平台实时信息为准。</p>
      </div>
      <div class="tp-section tp-food">
        <div class="tp-head">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11h16M8 4v4M16 4v4M6 11v8a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-8M14 11v8a1 1 0 0 0 1 1h2a1 1 0 0 0 1-1v-8"/></svg>
          <strong>本地美食推荐</strong>
        </div>
        <div class="tp-body">
          ${foodList.map(f => `
            <div class="tp-food-item">
              <div class="tp-item-head">
                <strong>${f.name || ''}</strong>
                <span>${f.area || ''}</span>
              </div>
              <p>${f.note || ''}</p>
            </div>`).join('')}
        </div>
      </div>`;
  }

  function summaryHTML(plan) {
    const usedPct = Math.min(100, Math.max(4, Math.round(plan.summary.totalCost / plan.budget * 100)));
    const framework = plan.framework || buildLocalFramework(plan);
    const guide = framework.guide || {};
    return `
      <p class="summary-label">预算使用</p>
      <div class="budget-block">
        <div class="budget-top">
          <span class="budget-amount">${fmtMoney(plan.summary.totalCost)}</span>
          <span class="budget-sub">已安排 / ${fmtMoney(plan.budget)}</span>
        </div>
        <div class="budget-bar"><span class="budget-bar-fill" style="width:${usedPct}%"></span></div>
      </div>
      <div class="stat-grid">
        <div class="stat-cell"><span class="stat-value">${fmtMoney(plan.summary.avgDay)}</span><span class="stat-name">日均安排</span></div>
        <div class="stat-cell"><span class="stat-value">${plan.summary.itemsCount}</span><span class="stat-name">安排项目</span></div>
        <div class="stat-cell"><span class="stat-value">${fmtMoney(Math.round(plan.budget / (plan.people || 2)))}</span><span class="stat-name">人均预算</span></div>
      </div>
      <p class="breakdown-title">天气与穿衣</p>
      <div class="guide-block">
        <div class="guide-row"><strong>天气预判</strong><span>${guide.weather || '出发前查询当地天气，按季节备衣'}</span><em class="guide-note">*仅为季节气候预判，实际出行前请查询当地实时天气预报</em></div>
        <div class="guide-row"><strong>穿衣建议</strong><span>${guide.clothing || '舒适轻便为主，备一件外套应对温差'}</span></div>
      </div>
      <p class="breakdown-title">游玩注意事项</p>
      <div class="guide-list">
        ${(guide.notes || []).map(note => `<div class="guide-item">${note}</div>`).join('') || '<div class="guide-item">提前预约热门景点，错峰出行</div>'}
      </div>
      <p class="breakdown-title">避坑提示</p>
      <div class="guide-list">
        ${(guide.pitfalls || []).map(pit => `<div class="guide-item">${pit}</div>`).join('') || '<div class="guide-item">谨慎选择低价一日游，谨防购物陷阱</div>'}
      </div>
      <p class="breakdown-title">出行小贴士</p>
      <div class="guide-list">
        ${(guide.tips || []).map(tip => `<div class="guide-item">${tip}</div>`).join('') || '<div class="guide-item">下载离线地图，随身携带充电宝</div>'}
      </div>`;
  }

  const FRONT_CITY_COORDS = {
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
  const FRONT_PROVINCE_CAPITAL = {
    '广西': '南宁', '广东': '广州', '四川': '成都', '浙江': '杭州', '云南': '昆明', '海南': '海口',
    '黑龙江': '哈尔滨', '吉林': '长春', '辽宁': '沈阳', '河南': '郑州', '湖北': '武汉', '湖南': '长沙',
    '江苏': '南京', '安徽': '合肥', '福建': '福州', '江西': '南昌', '山东': '济南', '山西': '太原',
    '陕西': '西安', '甘肃': '兰州', '青海': '西宁', '贵州': '贵阳', '河北': '石家庄', '内蒙古': '呼和浩特',
    '新疆': '乌鲁木齐', '西藏': '拉萨', '宁夏': '银川', '台湾': '台北'
  };

  function resolveFrontCityCoord(name) {
    if (FRONT_CITY_COORDS[name]) return FRONT_CITY_COORDS[name];
    const capital = FRONT_PROVINCE_CAPITAL[name];
    if (capital && FRONT_CITY_COORDS[capital]) return FRONT_CITY_COORDS[capital];
    const known = (window.LUSHU_CITY_CENTERS || {})[name];
    if (known) return [known[0], known[1]];
    return null;
  }

  function buildLocalTransport(departCity, destCity) {
    const a = resolveFrontCityCoord(departCity);
    const b = resolveFrontCityCoord(destCity);
    const km = a && b ? geoDistance({ lat: a[0], lng: a[1] }, { lat: b[0], lng: b[1] }) : 800;
    const roundKm = Math.max(100, Math.round(km / 50) * 50);
    const from = departCity || '出发城市';
    const to = destCity || '目的地';
    const primaryReason = (mode, arrive, depart, focus) => `从${from}到${to}约 ${roundKm} 公里，${mode}时间效率高，${arrive}抵达正好衔接第一天行程，${depart}出发给返程留足缓冲，${focus}。`;
    const backupReason = (mode, arrive, depart, focus) => `备选${mode}单程耗时更长但票价更省，适合预算优先的出行，${arrive}抵达、${depart}出发，${focus}。`;
    let primary;
    let backup;
    if (km <= 500) {
      primary = { mode: '高铁', arriveTime: '上午', departTime: '返程当天下午', duration: `${Math.max(1, Math.round(roundKm / 250 + 0.5))}-${Math.max(2, Math.round(roundKm / 220 + 0.5))} 小时`, priceRange: `约 ¥${Math.round(roundKm * 0.4 / 50) * 50} - ¥${Math.round(roundKm * 0.55 / 50) * 50}`, reason: primaryReason('高铁', '上午', '返程当天下午', '把完整白天留给游玩'), isBackup: false };
      backup = { mode: '普速火车', arriveTime: '下午', departTime: '返程当天上午', duration: `${Math.round(roundKm / 140)}-${Math.round(roundKm / 110)} 小时`, priceRange: `约 ¥${Math.round(roundKm * 0.18 / 10) * 10} - ¥${Math.round(roundKm * 0.28 / 10) * 10}`, reason: backupReason('普速火车', '下午', '返程当天上午', '夜间卧铺还能省一晚住宿'), isBackup: true };
    } else if (km <= 1500) {
      primary = { mode: '高铁', arriveTime: '下午', departTime: '返程当天上午', duration: `${Math.max(2, Math.round(roundKm / 280 + 0.5))}-${Math.max(3, Math.round(roundKm / 250 + 1))} 小时`, priceRange: `约 ¥${Math.round(roundKm * 0.38 / 50) * 50} - ¥${Math.round(roundKm * 0.52 / 50) * 50}`, reason: primaryReason('高铁', '下午', '返程当天上午', '把首日安排留给下午和夜晚，返程留足缓冲'), isBackup: false };
      backup = { mode: '飞机', arriveTime: '上午', departTime: '返程当天下午', duration: `约 ${Math.max(2, Math.round(roundKm / 700 + 2))}-${Math.max(3, Math.round(roundKm / 650 + 2.5))} 小时（含机场往返）`, priceRange: `约 ¥${Math.max(350, Math.round(roundKm * 0.55 / 50) * 50)} - ¥${Math.max(650, Math.round(roundKm * 0.9 / 50) * 50)}`, reason: backupReason('飞机', '上午', '返程当天下午', '中长途飞行节省体力，适合时间敏感场景'), isBackup: true };
    } else {
      primary = { mode: '飞机', arriveTime: '上午', departTime: '返程当天下午起飞', duration: `约 ${Math.max(3, Math.round(roundKm / 700 + 2))}-${Math.max(4, Math.round(roundKm / 650 + 2.5))} 小时（含机场往返）`, priceRange: `约 ¥${Math.max(600, Math.round(roundKm * 0.5 / 100) * 100)} - ¥${Math.max(1100, Math.round(roundKm * 0.9 / 100) * 100)}`, reason: primaryReason('飞机', '上午', '返程当天下午起飞', '务必预留机场往返市区的通勤时间'), isBackup: false };
      backup = { mode: '高铁', arriveTime: '下午', departTime: '返程当天上午', duration: `${Math.max(6, Math.round(roundKm / 260))}-${Math.max(8, Math.round(roundKm / 240))} 小时`, priceRange: `约 ¥${Math.round(roundKm * 0.4 / 50) * 50} - ¥${Math.round(roundKm * 0.55 / 50) * 50}`, reason: backupReason('高铁', '下午', '返程当天上午', '长途高铁票价更稳、准点率高，避免机场天气影响'), isBackup: true };
    }
    return { plans: [primary, backup] };
  }
  function buildLocalFramework(plan) {
    const city = cityFor(plan);
    const foodPool = getPool(city, 'food');
    const lodgingPool = (window.LUSHU_LODGING || {})[plan.destination] || [];
    const departCity = (lastForm && lastForm.departCity) || '出发城市';
    return {
      transport: buildLocalTransport(departCity, plan.destination),
      lodgingAreas: lodgingPool.slice(0, 4).map(item => ({
        name: item.area,
        priceRange: `约 ${fmtMoney(item.price)}/晚`,
        pros: item.desc,
        cons: '节假日价格会明显上浮',
        hotelExamples: item.name
      })),
      foodList: foodPool.slice(0, 6).map(item => ({
        name: item.name,
        area: item.area,
        note: item.desc
      })),
      guide: {
        weather: `${new Date().getMonth() + 1} 月当地以${new Date().getMonth() + 1 >= 3 && new Date().getMonth() + 1 <= 5 ? '温和湿润' : (new Date().getMonth() + 1 >= 6 && new Date().getMonth() + 1 <= 8 ? '炎热多雨' : (new Date().getMonth() + 1 >= 9 && new Date().getMonth() + 1 <= 11 ? '凉爽舒适' : '干冷'))}为主，早晚温差明显，出行前请确认实时天气`,
        clothing: '建议携带一件薄外套应对早晚温差，夏季备防晒衣与雨具，冬季备保暖层与防滑鞋',
        notes: ['热门景点建议提前 3-7 天预约', '周一博物馆闭馆，出发前确认开放时间'],
        pitfalls: ['谨慎选择路边揽客的一日游', '景区门口购物先比价'],
        tips: ['下载离线地图，随身携带充电宝', '市内出行优先地铁，高峰期预留时间']
      }
    };
  }
  function arriveSlotIndex(timeText) {
    const text = String(timeText || '');
    if (/上午|早上|清晨|早晨/.test(text)) return 0;
    if (/中午|下午/.test(text)) return 2;
    if (/傍晚|黄昏/.test(text)) return 3;
    return 4;
  }

  function applyFrameworkConstraints(plan) {
    if (!plan || !plan.days || !plan.days.length) return plan;
    const framework = plan.framework || buildLocalFramework(plan);
    const transportPlans = (framework.transport && framework.transport.plans) || [];
    const primary = transportPlans.find(p => !p.isBackup) || transportPlans[0];
    const order = { morning: 0, lunch: 1, afternoon: 2, dinner: 3, evening: 4 };

    if (primary && primary.arriveTime && plan.days[0]) {
      const minIndex = arriveSlotIndex(primary.arriveTime);
      const firstDay = plan.days[0];
      if (firstDay && firstDay.items) {
        const kept = firstDay.items.filter(item => (order[item.slotKey] !== undefined ? order[item.slotKey] : 0) >= minIndex);
        firstDay.items = kept.length ? kept : firstDay.items.slice(-1);
      }
    }
    plan.days.forEach(day => {
      let transitMinutes = 0;
      let totalDistanceKm = 0;
      const city = cityFor(plan);
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
function tipFor(plan) {
    if (plan.prefs.length === 1) {
      return `这次行程重点围绕「${plan.prefs[0]}」展开，其他时段留给了自由漫步，适合轻松出发。`;
    }
    return `「${plan.prefs.slice(0, 2).join('」和「')}」偏好已优先加权，每天集中在同一片区，减少来回折腾。`;
  }

  function itemHTML(plan, item, dayIndex, itemIndex, prevItem) {
    const fixed = Boolean(item.fixed);
    let transferText = '';
    if (!fixed && prevItem) {
      const city = cityFor(plan);
      const minutes = transferMinutes(city, prevItem.area, item.area);
      const mode = minutes <= 15 ? '步行' : (minutes <= 35 ? '地铁/公交' : '打车');
      transferText = `${mode}约 ${minutes} 分钟`;
    }
    return `
      <article class="timeline-item${fixed ? ' is-fixed' : ''}${item.done ? ' is-done' : ''}" draggable="${fixed ? 'false' : 'true'}" data-day="${dayIndex}" data-index="${itemIndex}" data-item="true">
        ${fixed ? '' : '<span class="drag-handle" aria-hidden="true">⋮⋮</span>'}
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
            <div class="item-head-actions">
              ${fixed ? '' : `
                <button class="item-copy" type="button" data-copy-item="${itemIndex}" data-day="${dayIndex}" aria-label="复制 ${item.name}">
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                </button>
                <button class="item-done${item.done ? ' is-checked' : ''}" type="button" data-day="${dayIndex}" data-index="${itemIndex}" aria-label="${item.done ? '标记未完成' : '标记完成'}">
                  <svg class="unchecked" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/></svg>
                  <svg class="checked" viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12 5 5L20 7"/></svg>
                </button>`}
              <span class="item-cost">${item.cost ? fmtMoney(item.cost) : '免费'}</span>
              ${fixed ? '' : `
                <button class="item-delete" type="button" data-day="${dayIndex}" data-index="${itemIndex}" aria-label="删除 ${item.name}">
                  <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6"/></svg>
                </button>`}
            </div>
          </div>
          <div class="item-meta-row">
            <span class="item-type type-${item.cat}">${itemTypeLabel(item.cat)}</span>
            <span>${item.area}</span>
            ${item.duration ? `<span>约 ${item.duration} 分钟</span>` : ''}
            ${transferText ? `<span class="transfer-note">↗ ${transferText}</span>` : ''}
            ${!fixed && item.cost > 0 ? `
              <label class="book-toggle">
                <input type="checkbox" data-book-item="${itemIndex}" data-day="${dayIndex}" ${item.booked ? 'checked' : ''}>
                <span>已预订</span>
              </label>` : ''}
            </div>
            <p class="item-desc">${item.desc}</p>
            <div class="item-tags">${(item.tags || []).map(tag => `<span class="mini-tag">${tag}</span>`).join('')}</div>
          </div>
      </article>`;
  }

  function dayCardHTML(plan, day, index) {
    const topItem = {
      name: '市内交通预留',
      area: '市内',
      cost: day.transport,
      duration: 0,
      desc: '地铁、打车或包车预留，按当天路线灵活安排。',
      tags: ['交通', '预留'],
      slotLabel: '全天',
      time: '按需',
      cat: 'transport',
      fixed: true
    };
    const isLastDay = index === plan.days.length - 1;
    const framework = plan.framework || buildLocalFramework(plan);
    const primaryTransport = (framework.transport && framework.transport.plans || []).find(p => !p.isBackup) || (framework.transport && framework.transport.plans || [])[0];
    const departTime = (primaryTransport && primaryTransport.departTime) || '上午';
    const stayInfo = lodgingForPlan(plan);
    const stayItem = isLastDay ? {
      name: '返程预留',
      area: '返程',
      cost: 0,
      duration: 0,
      desc: `建议按优先方案在${departTime}出发返程，预留充足时间前往车站/机场。`,
      tags: ['返程', '预留'],
      slotLabel: '返程',
      time: departTime,
      cat: 'transport',
      fixed: true
    } : {
      name: lodgingDisplayName(stayInfo),
      area: stayInfo.area,
      cost: day.lodging,
      duration: 0,
      desc: `${stayInfo.desc}（${stayInfo.type}，参考价 ${fmtMoney(stayInfo.price)}/晚）`,
      tags: [stayInfo.type, ...(stayInfo.tags || [])],
      slotLabel: '夜晚',
      time: '22:00 后',
      cat: 'stay',
      fixed: true
    };
    const editableItems = day.items;
    const truncated = editableItems.length > 14 && !day._expanded;
    const shownItems = truncated ? editableItems.slice(0, 14) : editableItems;
    const mode = plan.transportMode && plan.transportMode[index] ? plan.transportMode[index] : 'transit';
    const itemsHTML = [
      itemHTML(plan, topItem, index, -1),
      ...shownItems.map((item, itemIndex) => {
        const prevItem = itemIndex > 0 ? shownItems[itemIndex - 1] : topItem;
        return itemHTML(plan, item, index, itemIndex, prevItem);
      }),
      itemHTML(plan, stayItem, index, -2)
    ].join('');
    return `
      <details class="day-card" data-day="${index}" ${index === 0 ? 'open' : ''}>
        <summary class="day-card-head">
          <div class="day-theme">
            <span class="day-index-badge">${index + 1}</span>
            <div>
              <strong>${day.theme}</strong>
              <span>第 ${index + 1} 天 · ${day.area} · ${plan.people || 2} 人 · 约 ${day.totalDistanceKm || 0} km / 路上 ${day.transitMinutes || 0} 分钟</span>
            </div>
          </div>
          <div class="day-card-cost">
            <strong>${fmtMoney(day.cost)}</strong>
            <span>含住宿与交通</span>
          </div>
          <span class="day-card-chevron" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
          </span>
        </summary>
        <div class="day-card-body">
          <div class="budget-options">
            <label class="setting-toggle">
              <span>交通方式</span>
              <select data-transport-mode="${index}">
                <option value="transit" ${mode === 'transit' ? 'selected' : ''}>公共交通</option>
                <option value="taxi" ${mode === 'taxi' ? 'selected' : ''}>打车</option>
              </select>
            </label>
            <span class="transport-estimate">交通预估 ${fmtMoney(day.transport)}</span>
          </div>
          <div class="timeline">${itemsHTML}</div>
          <div class="day-card-actions">
            <button class="add-item-btn" type="button" data-day="${index}">
              <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>
              添加项目
            </button>
            ${truncated ? `
              <button class="add-item-btn" type="button" data-expand-day="${index}">
                展开全部（${editableItems.length} 项）
              </button>` : ''}
          </div>
          <div class="day-note">
            <label class="day-note-label" for="dayNote-${index}">备注（预约 / 穿搭 / 避雷）</label>
            <textarea id="dayNote-${index}" data-day-note="${index}" placeholder="例如：灵隐寺需提前预约，记得带薄外套">${day.notes || ''}</textarea>
          </div>
          <div class="day-card-footer-actions">
            <button class="btn copy-day-btn" type="button" data-copy-day="${index}">
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
              复制单日
            </button>
            <button class="btn copy-day-btn" type="button" data-local-day="${index}">局部优化</button>
          </div>
        </div>
      </details>`;
  }

  function renderResult(plan, options = {}) {
    const preserveOpen = options.preserveOpen && !$('#result').hidden;
    const openStates = preserveOpen ? [...document.querySelectorAll('.day-card')].map(card => card.open) : null;
    const oldPlan = currentPlan;
    currentPlan = plan;
    if (!plan.framework) plan.framework = buildLocalFramework(plan);
    applyFrameworkConstraints(plan);
    if (!oldPlan || oldPlan.destination !== plan.destination || (oldPlan.dayCount || oldPlan.days.length) !== (plan.dayCount || plan.days.length)) {
      resetMap();
    }
    renderResultHead(plan);
    renderTopPlanning(plan);
    $('#resultSummary').innerHTML = summaryHTML(plan);
    $('#dayCards').innerHTML = plan.days.map((day, index) => dayCardHTML(plan, day, index)).join('');
    $('#skeletonWrap').hidden = true;
    updateContextUI();
    if (openStates) {
      document.querySelectorAll('.day-card').forEach((card, index) => {
        if (openStates[index] !== undefined) card.open = openStates[index];
      });
    }
    $('#emptyState').hidden = true;
    $('#result').hidden = false;
    if (options.scroll !== false) scrollToEl($('#result'));
    applyPlanSearch();
  }

  function getSavedPlans() {
    const user = currentUser();
    if (!user) return [];
    try {
      const raw = localStorage.getItem(STORAGE.plans);
      const list = raw ? JSON.parse(raw) : [];
      return Array.isArray(list) ? list.filter(item => item.owner === user) : [];
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

  function setPrefs(prefs) {
    document.querySelectorAll('input[name="pref"]').forEach(input => {
      input.checked = prefs.includes(input.value);
    });
  }

  function readForm() {
    const budgetMin = clamp(parseInt($('#budgetMin').value, 10) || 1000, 500, 100000);
    const budgetMax = clamp(parseInt($('#budgetMax').value, 10) || 6000, 500, 100000);
    const min = Math.min(budgetMin, budgetMax);
    const max = Math.max(budgetMin, budgetMax);
    const fromDates = calcDays($('#startDate').value, $('#endDate').value);
    const days = fromDates || clamp(parseInt($('#days').value, 10) || 1, 1, 14);
      return {
        destination: $('#destination').value.trim(),
        departCity: $('#departCity').value.trim(),
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
    $('#destination').value = form.destination || '';
    $('#departCity').value = form.departCity || '';
    $('#startDate').value = form.startDate || '';
    $('#endDate').value = form.endDate || '';
    $('#people').value = form.people || 2;
    $('#days').value = form.days || 3;
    $('#budgetMin').value = form.budgetMin || 3000;
    $('#budgetMax').value = form.budgetMax || 6000;
    $('#notes').value = form.notes || '';
    setPrefs(form.prefs && form.prefs.length ? form.prefs : ['美食', '休闲']);
    const crowdInput = document.querySelector(`input[name="crowd"][value="${form.crowd || '情侣'}"]`);
    if (crowdInput) crowdInput.checked = true;
    const paceInput = document.querySelector(`input[name="pace"][value="${form.pace || '深度打卡'}"]`);
    if (paceInput) paceInput.checked = true;
    updateBudgetNote();
  }

  function saveFormState() {
    try {
      safeSetItem(STORAGE.form, readForm());
    } catch (err) {
      /* 本地缓存不可用时静默降级 */
    }
  }

  function restoreFormState() {
    try {
      const raw = localStorage.getItem(STORAGE.form);
      if (raw) applyForm(JSON.parse(raw));
    } catch (err) {
      /* 缓存数据损坏时使用默认值 */
    }
  }

  function persistLastPlan(plan) {
    try {
      safeSetItem(STORAGE.lastPlan, plan);
    } catch (err) {
      /* 本地缓存不可用时静默降级 */
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
      /* 缓存数据损坏时忽略 */
    }
  }

  function fillFormFromPlan(plan) {
    applyForm({
      destination: plan.destination,
      startDate: plan.startDate || '',
      endDate: plan.endDate || '',
      people: plan.people || 2,
      days: plan.days,
      budgetMin: plan.budgetRange ? plan.budgetRange.min : Math.max(500, plan.budget - 1000),
      budgetMax: plan.budgetRange ? plan.budgetRange.max : plan.budget + 1000,
      notes: plan.notes || '',
      prefs: plan.prefs
    });
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
        currentPlan = dedupePlan(entry.plan);
        fillFormFromPlan(currentPlan);
        renderResult(currentPlan);
        closeSavedModal();
        showToast('已载入行程');
      });
    });

    container.querySelectorAll('[data-delete]').forEach(button => {
      button.addEventListener('click', () => removeSavedPlan(button.dataset.delete));
    });
  }

  function saveCurrentPlan() {
    if (!currentPlan) return;
    if (!currentUser()) {
      showToast('请先登录后再保存');
      return;
    }
    const list = getSavedPlans();
    const existingIndex = list.findIndex(item => item.id === currentPlan.id);
    if (existingIndex >= 0) {
      list[existingIndex].plan = currentPlan;
        list[existingIndex].updatedAt = new Date().toLocaleString('zh-CN');
        safeSetItem(STORAGE.plans, list);
        updateSavedBadge();
        showToast('行程已更新');
      } else {
        list.unshift({
          id: currentPlan.id,
          owner: currentUser(),
          createdAt: new Date().toLocaleString('zh-CN'),
          plan: currentPlan
        });
        safeSetItem(STORAGE.plans, list.slice(0, 8));
        updateSavedBadge();
        showToast('已保存到「我的行程」');
      }
      cloudUpsertPlan(currentPlan);
    }

    function removeSavedPlan(id) {
      const list = getSavedPlans().filter(item => item.id !== id);
      safeSetItem(STORAGE.plans, list);
      renderSavedList();
      updateSavedBadge();
      cloudDeletePlan(id);
    }

  function buildPlanText(plan, customTitle) {
    const title = customTitle || plan.title || `${plan.destination} · ${plan.dayCount || plan.days.length} 天 ${plan.people || 2} 人行程`;
    const lines = [
      title,
      `日期：${plan.startDate || '未指定'} 至 ${plan.endDate || '未指定'}`,
      `预算区间：${fmtMoney(plan.budgetRange.min)} - ${fmtMoney(plan.budgetRange.max)}（按 ${fmtMoney(plan.budget)} 生成）`,
      `人群：${plan.crowd || '情侣'} · 节奏：${plan.pace || '深度打卡'}`,
      `偏好：${plan.prefs.join('、') || '无'}`,
      plan.notes ? `补充需求：${plan.notes}` : '',
      ''
    ].filter(Boolean);
    plan.days.forEach(day => {
      lines.push(`第 ${day.day} 天 · ${day.theme}（${day.area}）约 ${fmtMoney(day.cost)}，其中住宿预留 ${fmtMoney(day.lodging)}、交通预留 ${fmtMoney(day.transport)}`);
      lines.push(`  全天 按需 市内交通预留 - ${day.transport ? fmtMoney(day.transport) : '免费'}（交通）`);
      day.items.forEach(item => {
        lines.push(`  ${item.slotLabel} ${item.time} ${item.name} - ${item.cost ? fmtMoney(item.cost) : '免费'}（${itemTypeLabel(item.cat)}）`);
      });
      lines.push(`  夜晚 22:00 后 住宿预留 - ${fmtMoney(day.lodging)}（住宿）`);
      lines.push('');
    });
    lines.push(`合计已安排：${fmtMoney(plan.summary.totalCost)} / 预算 ${fmtMoney(plan.budget)}`);
    return lines.join('\n');
  }

  function copyCurrentPlan() {
    if (!currentPlan) return;
    copyText(buildPlanText(currentPlan), '行程已复制，可以粘贴到聊天或备忘录');
  }

  function exportCurrentPlan() {
    if (!currentPlan) return;
    const dayCount = currentPlan.dayCount || currentPlan.days.length;
    const defaultTitle = currentPlan.title || `${currentPlan.destination} ${dayCount}天`;
    const customTitle = window.prompt('给这份行程起个标题（用于导出文件名）', defaultTitle) || defaultTitle;
    downloadText(buildPlanText(currentPlan, customTitle), `${sanitizeFilename(customTitle)}.txt`);
    showToast('简易清单已导出');
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
          const trimmed = Array.isArray(value) ? value.slice(0, 6) : value;
          localStorage.setItem(key, JSON.stringify(trimmed));
        } catch (err2) {
          /* 缓存已满时放弃保存 */
        }
      }
    }
  }

  function copyText(text, successMessage = '内容已复制') {
    const done = () => showToast(successMessage);
    const fallback = () => {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      textarea.remove();
      done();
    };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, fallback);
    } else {
      fallback();
    }
  }

  function friendlyErrorMessage(err) {
    const msg = err && err.message ? String(err.message) : '';
    if (/timeout|timed out|超时/i.test(msg)) return '生成超时，请稍后重试';
    if (/rate|limit|限流|429/i.test(msg)) return '请求过于频繁，请稍等片刻再试';
    if (/api key|密钥|401|403/i.test(msg)) return '服务密钥配置异常，请检查后重试';
    if (/network|fetch|failed to fetch|网络/i.test(msg)) return '网络异常，请检查网络连接后重试';
    return '生成失败，请稍后重试';
  }

  function parseTimeToMinutes(timeStr) {
    const match = String(timeStr || '').match(/(\d{1,2}):(\d{2})/);
    if (!match) return null;
    return Number(match[1]) * 60 + Number(match[2]);
  }

  function estimateTransfer(areaA, areaB) {
    if (!areaA || !areaB || areaA === areaB) return 10;
    if (areaA === '沿途' || areaB === '沿途' || areaA === '市内' || areaB === '市内') return 20;
    let seed = 7;
    const text = areaA + areaB;
    for (let i = 0; i < text.length; i++) {
      seed = (seed * 31 + text.charCodeAt(i)) % 997;
    }
    return 30 + (seed % 31);
  }

  function validatePlan(plan) {
    const risks = [];
    if (!plan || !plan.days) return risks;
    const city = cityFor(plan);
    plan.days.forEach(day => {
      const realItems = day.items.filter(item => item && !item.fixed);
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
        risks.push(`第 ${day.day} 天跨 ${crossCount} 个区域移动，路线较散，建议合并同区域景点`);
      }
    });
    return risks.slice(0, 8);
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

  function dedupePlan(plan) {
    if (!plan || !plan.days) return plan;
    const city = cityFor(plan);
    const seen = new Set();
    const placeholderNames = new Set(['酒店附近早餐', '沿途简餐', '简单晚餐', '市内交通预留', '住宿预留']);
    plan.days.forEach(day => {
      day.items.forEach(item => {
        if (!item || item.fixed) return;
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
    plan.risks = validatePlan(plan);
    return plan;
  }

  function formFromPlan(plan) {
    const dayCount = plan.dayCount || plan.days.length;
    return {
      destination: plan.destination,
      startDate: plan.startDate || '',
      endDate: plan.endDate || '',
      people: plan.people || 2,
      days: dayCount,
      budgetMin: plan.budgetRange ? plan.budgetRange.min : plan.budget,
      budgetMax: plan.budgetRange ? plan.budgetRange.max : plan.budget,
      budget: plan.budget,
      budgetRange: plan.budgetRange || { min: plan.budget, max: plan.budget },
      prefs: plan.prefs,
      notes: plan.notes || '',
      crowd: plan.crowd || '情侣',
      pace: plan.pace || '深度打卡'
    };
  }

  function addDaysToDateStr(dateStr, offset) {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) return '';
    date.setDate(date.getDate() + offset);
    return toDateStr(date);
  }

  function pushContext(message) {
    contextHistory.push({
      time: new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
      message
    });
    if (contextHistory.length > 20) contextHistory = contextHistory.slice(-20);
    updateContextUI();
  }

  function updateContextUI() {
    const countEl = $('#contextCount');
    if (!countEl) return;
    const count = contextHistory.length;
    countEl.textContent = count;
    countEl.hidden = count === 0;
  }

  function schedulePersist() {
    clearTimeout(persistTimer);
    persistTimer = setTimeout(() => {
      if (!currentPlan) return;
      persistLastPlan(currentPlan);
      const list = getSavedPlans();
      const index = list.findIndex(item => item.id === currentPlan.id);
      if (index >= 0) {
        list[index].plan = currentPlan;
        safeSetItem(STORAGE.plans, list);
      }
    }, 400);
  }

  function scheduleRefresh() {
    clearTimeout(refreshTimer);
    refreshTimer = setTimeout(() => {
      if (!currentPlan) return;
      renderResult(currentPlan, { preserveOpen: true, scroll: false });
      persistLastPlan(currentPlan);
    }, 260);
  }


  let mapDayIndex = 0;

  function resetMap() {
    mapDayIndex = 0;
  }

  function buildRouteStops(plan, day) {
    const city = cityFor(plan);
    const stayInfo = lodgingForPlan(plan);
    const stayName = lodgingDisplayName(stayInfo);
    const stops = [{ name: stayName, slot: '起点', cat: 'stay', area: stayInfo.area }];
    day.items.forEach(item => {
      if (item.cat === 'transport') return;
      stops.push({ name: item.name, slot: item.slotLabel, cat: item.cat, area: item.area });
    });
    stops.push({ name: stayName, slot: '返程', cat: 'stay', area: stayInfo.area });
    const legs = [];
    for (let i = 1; i < stops.length; i++) {
      const minutes = transferMinutes(city, stops[i - 1].area, stops[i].area);
      const coordA = areaCoord(city, stops[i - 1].area);
      const coordB = areaCoord(city, stops[i].area);
      const km = geoDistance(coordA, coordB);
      legs.push({ minutes, km: Math.round(km * 10) / 10 });
    }
    return { stops, legs };
  }

  function routeMapHTML(stops, legs) {
    return `
      <div class="route-map">
        <div class="route-stops">
          ${stops.map((stop, index) => `
            ${index > 0 ? `
              <div class="route-leg" title="约 ${legs[index - 1].minutes} 分钟 · ${legs[index - 1].km} km">
                <span class="leg-time">${legs[index - 1].minutes} 分钟</span>
                <span class="leg-line"></span>
                <span class="leg-km">${legs[index - 1].km} km</span>
              </div>` : ''}
            <div class="route-stop" title="${stop.name}">
              <span class="route-dot cat-${stop.cat}"></span>
              <span class="route-slot">${stop.slot}</span>
              <span class="route-name">${stop.name}</span>
            </div>
          `).join('')}
        </div>
      </div>`;
  }

  function renderMap(plan, dayIndex) {
    const wrap = $('#mapWrap');
    const container = $('#itineraryMap');
    if (!wrap || !container || !plan || !plan.days.length) return;
    if (dayIndex >= plan.days.length) dayIndex = 0;
    mapDayIndex = dayIndex;
    wrap.hidden = false;

    const day = plan.days[dayIndex];
    const totalKm = day.totalDistanceKm || 0;
    const transit = day.transitMinutes || 0;
    const crossCount = day.items.reduce((sum, item, index) => {
      if (index === 0) return sum;
      return sum + (item.area !== day.items[index - 1].area ? 1 : 0);
    }, 0);

    const statsEl = $('#mapStats');
    if (statsEl) {
      statsEl.innerHTML = `
        <div class="map-stat">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>
          <div><strong>${totalKm} km</strong><span>当日里程</span></div>
        </div>
        <div class="map-stat">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h12a4 4 0 0 1 4 4v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"/><path d="M4 11h16M8 17v2M16 17v2"/></svg>
          <div><strong>${transit} 分钟</strong><span>路上时间</span></div>
        </div>
        <div class="map-stat">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
          <div><strong>${crossCount} 次</strong><span>跨区移动</span></div>
        </div>`;
    }

    const { stops, legs } = buildRouteStops(plan, day);
    container.innerHTML = routeMapHTML(stops, legs);
  }

  function renderMapTabs(plan) {
    const tabs = $('#mapDayTabs');
    if (!tabs || !plan) return;
    tabs.innerHTML = plan.days.map((day, index) => `
      <button class="map-day-tab${index === mapDayIndex ? ' is-active' : ''}" type="button" data-map-day="${index}">第 ${index + 1} 天</button>
    `).join('');
  }

  function setupMapTabs() {
    const tabs = $('#mapDayTabs');
    if (!tabs || tabs.dataset.bound) return;
    tabs.dataset.bound = 'true';
    tabs.addEventListener('click', event => {
      const btn = event.target.closest('[data-map-day]');
      if (!btn || !currentPlan) return;
      const index = Number(btn.dataset.mapDay);
      if (index === mapDayIndex || !currentPlan.days[index]) return;
      mapDayIndex = index;
      renderMapTabs(currentPlan);
      renderMap(currentPlan, index);
    });
  }
  function renderResultHead(plan) {
    const dayCount = plan.dayCount || plan.days.length;
    const dateText = plan.startDate && plan.endDate ? `${plan.startDate} 至 ${plan.endDate}` : `${dayCount} 天`;
    $('#resultTitle').textContent = `${plan.destination} · ${dayCount} 天 ${plan.people || 2} 人行程`;
    const form = lastForm || plan;
    const range = form.budgetRange || plan.budgetRange;
    const people = form.people || plan.people || 2;
    const prefs = (form.prefs && form.prefs.length) ? form.prefs : (plan.prefs || []);
    $('#resultTags').innerHTML = [
      `预算区间 ${fmtMoney(range.min)} - ${fmtMoney(range.max)}`,
      dateText,
      `${people} 人`,
      ...prefs
    ].map(tag => `<span class="result-tag">${tag}</span>`).join('');
  }

  async function renderStreaming(plan) {
    currentPlan = plan;
    if (!plan.framework) plan.framework = buildLocalFramework(plan);
    applyFrameworkConstraints(plan);
    renderResultHead(plan);
    renderTopPlanning(plan);
    $('#resultSummary').innerHTML = '';
    $('#dayCards').innerHTML = '';
    $('#skeletonWrap').hidden = false;
    $('#skeletonWrap').innerHTML = plan.days.map(() => '<div class="skeleton-card"></div>').join('');
    $('#emptyState').hidden = true;
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
    $('#resultSummary').innerHTML = summaryHTML(plan);
    updateContextUI();
    applyPlanSearch();
  }

  function downloadText(text, filename) {
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  function copySingleDay(dayIndex) {
    if (!currentPlan || !currentPlan.days[dayIndex]) return;
    const day = currentPlan.days[dayIndex];
    const lines = [
      `第 ${day.day} 天 · ${day.theme}（${day.area}）`,
      `当日约 ${fmtMoney(day.cost)}，含住宿 ${fmtMoney(day.lodging)}、交通 ${fmtMoney(day.transport)}`,
      ''
    ];
    lines.push(`  全天 按需 市内交通预留 - ${day.transport ? fmtMoney(day.transport) : '免费'}`);
    day.items.forEach(item => {
      lines.push(`  ${item.slotLabel} ${item.time} ${item.name} - ${item.cost ? fmtMoney(item.cost) : '免费'}（${itemTypeLabel(item.cat)}）`);
    });
    lines.push(`  夜晚 22:00 后 住宿预留 - ${fmtMoney(day.lodging)}`);
    copyText(lines.join('\n'), '已复制单日行程');
  }

  function refreshDayCost(day) {
    const itemsCost = day.items.reduce((sum, item) => sum + item.cost, 0);
    const fees = day.items.reduce((sum, item) => sum + (item.booked ? Math.round(item.cost * 0.05) : 0), 0);
    day.cost = itemsCost + fees + day.lodging + day.transport;
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

  function copySingleItem(dayIndex, itemIndex) {
    if (!currentPlan || !currentPlan.days[dayIndex]) return;
    const item = currentPlan.days[dayIndex].items[itemIndex];
    if (!item) return;
    const lines = [
      `${item.name}（${itemTypeLabel(item.cat)}）`,
      `${item.slotLabel} ${item.time} · ${item.area}`,
      item.cost ? `预估花费：${fmtMoney(item.cost)}` : '预估花费：免费',
      item.desc || '',
      item.tags && item.tags.length ? `标签：${item.tags.join(' / ')}` : ''
    ].filter(Boolean);
    copyText(lines.join('\n'), '已复制单个景点方案');
  }

  function localOptimizeDay(dayIndex) {
    const plan = currentPlan;
    if (!plan || !plan.days[dayIndex]) return;
    const day = plan.days[dayIndex];
    const form = formFromPlan(plan);
    const target = Math.max(200, Math.round((day.cost - day.lodging - day.transport) * 1.05 / 10) * 10);
    const used = new Set();
      plan.days.forEach((otherDay, otherIndex) => {
        if (otherIndex !== dayIndex) otherDay.items.forEach(item => used.add(item.name + '|' + item.area));
      });
      const options = { people: form.people, pace: form.pace, crowd: form.crowd };
    const city = cityFor(plan) || {
      name: plan.destination,
      areas: ['市中心', '老城区', '滨江路', '文化区', '艺术区'],
      food: GENERIC_POOL.food,
      sight: GENERIC_POOL.sight,
      photo: GENERIC_POOL.photo
    };
    const rebuilt = buildDay(city, dayIndex, plan.days.length, plan.prefs, target, used, options);
    const oldByKey = new Map(day.items.map(item => [item.name, item]));
    day.items = rebuilt.items.map(item => {
      const old = oldByKey.get(item.name);
      return old ? { ...item, done: old.done, notes: old.notes, booked: old.booked } : item;
    });
    day.theme = rebuilt.theme;
    day.area = rebuilt.area;
    day.lodging = rebuilt.lodging;
    day.transport = rebuilt.transport;
      day.baseTransport = rebuilt.baseTransport;
      refreshDayCost(day);
      dedupePlan(plan);
      renderResult(plan, { preserveOpen: true, scroll: false });
    schedulePersist();
    addHistory(plan);
    showToast(`第 ${dayIndex + 1} 天已局部重新编排，其他日期保持不变`);
    return plan;
  }

  function duplicatePlan() {
    if (!currentPlan) return;
    const copy = JSON.parse(JSON.stringify(currentPlan));
    copy.id = 'plan-' + Date.now();
    copy.title = `${currentPlan.title || currentPlan.destination} 副本`;
    copy.duplicatedAt = new Date().toLocaleString('zh-CN');
    currentPlan = copy;
    addHistory(copy);
    renderResult(copy);
    persistLastPlan(copy);
    showToast('已创建副本，可在副本上继续修改');
  }

  function getHistory() {
    const user = currentUser();
    if (!user) return [];
    try {
      const raw = localStorage.getItem('lushu-history-v1');
      const list = raw ? JSON.parse(raw) : [];
      return Array.isArray(list) ? list.filter(item => item.owner === user) : [];
    } catch (err) {
      return [];
    }
  }

  function addHistory(plan) {
    const list = getHistory();
    list.unshift({
      id: plan.id,
      owner: currentUser(),
      createdAt: new Date().toLocaleString('zh-CN'),
      plan: JSON.parse(JSON.stringify(plan))
    });
    const seen = new Set();
    const deduped = list.filter(entry => {
      if (seen.has(entry.id)) return false;
      seen.add(entry.id);
      return true;
    });
    safeSetItem('lushu-history-v1', deduped.slice(0, 8));
  }

  function renderHistoryList() {
    const list = getHistory();
    const container = $('#historyList');
    const empty = $('#historyEmpty');
    empty.hidden = list.length > 0;
    container.innerHTML = list.map(entry => {
      const plan = entry.plan;
      return `
        <div class="saved-item">
          <div class="saved-info">
            <strong>${plan.title || `${plan.destination} · ${plan.dayCount || plan.days.length} 天`}</strong>
            <span>${plan.destination} · ${plan.dayCount || plan.days.length} 天 · 预算 ${fmtMoney(plan.budget)}</span>
            <span>${entry.createdAt}</span>
          </div>
          <div class="saved-actions">
            <button type="button" data-history-load="${entry.id}">切换</button>
            <button type="button" data-history-copy="${entry.id}">复制副本</button>
            <button type="button" data-history-delete="${entry.id}">删除</button>
          </div>
        </div>`;
    }).join('');
    container.querySelectorAll('[data-history-load]').forEach(button => {
      button.addEventListener('click', () => {
        const entry = getHistory().find(item => item.id === button.dataset.historyLoad);
          if (!entry) return;
          currentPlan = JSON.parse(JSON.stringify(entry.plan));
          currentPlan = dedupePlan(currentPlan);
          renderResult(currentPlan);
        persistLastPlan(currentPlan);
        closeHistoryModal();
        showToast('已切换到历史方案');
      });
    });
    container.querySelectorAll('[data-history-copy]').forEach(button => {
      button.addEventListener('click', () => {
        const entry = getHistory().find(item => item.id === button.dataset.historyCopy);
        if (!entry) return;
          const copy = JSON.parse(JSON.stringify(entry.plan));
          copy.id = 'plan-' + Date.now();
          copy.title = `${copy.title || copy.destination} 副本`;
          currentPlan = dedupePlan(copy);
        addHistory(copy);
        renderResult(copy);
        persistLastPlan(copy);
        closeHistoryModal();
        showToast('已从历史方案创建副本');
      });
    });
    container.querySelectorAll('[data-history-delete]').forEach(button => {
      button.addEventListener('click', () => {
        const list = getHistory().filter(item => item.id !== button.dataset.historyDelete);
        safeSetItem('lushu-history-v1', list);
        renderHistoryList();
      });
    });
  }

  function openHistoryModal() {
    renderHistoryList();
    $('#historyModal').hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function closeHistoryModal() {
    $('#historyModal').hidden = true;
    document.body.style.overflow = '';
  }

  function backupData() {
    const readJson = key => {
      try {
        return JSON.parse(localStorage.getItem(key));
      } catch (err) {
        return null;
      }
    };
    const backup = {
      exportedAt: new Date().toISOString(),
      savedPlans: getSavedPlans(),
      history: getHistory(),
      form: readJson(STORAGE.form),
      lastPlan: readJson(STORAGE.lastPlan)
    };
    downloadText(JSON.stringify(backup, null, 2), `路书备份-${new Date().toISOString().slice(0, 10)}.json`);
    showToast('数据备份已导出');
  }

  function applyPlanSearch() {
    const query = $('#planSearch').value.trim().toLowerCase();
    const panel = $('#searchResults');
    document.querySelectorAll('.timeline-item.is-search-hit').forEach(el => el.classList.remove('is-search-hit'));
    if (!panel) return;
    if (!query || !currentPlan) {
      panel.hidden = true;
      panel.innerHTML = '';
      return;
    }
    const matches = [];
    currentPlan.days.forEach((day, dayIndex) => {
      day.items.forEach((item, itemIndex) => {
        if (item.fixed || item.cat === 'transport' || item.cat === 'stay') return;
        const text = `${item.name} ${item.desc || ''} ${(item.tags || []).join(' ')}`.toLowerCase();
        if (text.includes(query)) {
          matches.push({ dayIndex, itemIndex, item });
        }
      });
    });
    if (!matches.length) {
      panel.innerHTML = '<p class="search-empty">未找到相关安排，换个关键词试试</p>';
      panel.hidden = false;
      return;
    }
    panel.innerHTML = matches.slice(0, 12).map(({ dayIndex, itemIndex, item }) => `
      <button class="search-result" type="button" data-search-day="${dayIndex}" data-search-index="${itemIndex}">
        <span class="search-result-icon cat-${item.cat}">${ICONS[item.cat] || ICONS.walk}</span>
        <span class="search-result-main">
          <strong>${item.name}</strong>
          <span>第 ${dayIndex + 1} 天 · ${item.slotLabel}</span>
        </span>
        <span class="search-result-cost">${item.cost ? fmtMoney(item.cost) : '免费'}</span>
      </button>`).join('');
    panel.hidden = false;
  }

  async function generateWithRetry(form, attempts = 2) {
    try {
      const data = await apiFetch('/api/generate', {
        method: 'POST',
        body: JSON.stringify({ form }),
        timeoutMs: 90000
      });
      if (data && data.plan) return normalizeCloudPlan(data.plan, form);
      throw new Error('AI 返回的行程为空');
    } catch (err) {
      if (err.status && err.status >= 400 && err.status < 500) {
        showToast(err.message || 'AI 生成失败');
      }
      let lastError;
      for (let i = 0; i < attempts; i++) {
        try {
          return generateItinerary(form);
        } catch (localErr) {
          lastError = localErr;
          if (i < attempts - 1) await delay(500);
        }
      }
      throw lastError;
    }
  }

  function inferItemCat(item, slotKey) {
    if (slotKey === 'lunch' || slotKey === 'dinner') return 'food';
    const text = `${item.name || ''} ${item.desc || ''} ${(item.tags || []).join(' ')}`;
    if (/拍照|夜景|日落|街拍|机位|出片/.test(text)) return 'photo';
    if (/吃|餐|馆|火锅|小吃|美食|菜/.test(text)) return 'food';
    return 'sight';
  }

  function normalizeCloudPlan(plan, form) {
    if (!plan || !Array.isArray(plan.days) || !plan.days.length) {
      throw new Error('AI 返回的行程格式不正确');
    }
    plan.id = plan.id || 'plan-' + Date.now();
    plan.destination = plan.destination || form.destination;
    plan.days = plan.days.map((day, index) => {
      day.day = index + 1;
      day.items = (day.items || []).map(item => {
        const slotKey = SLOTS.some(slot => slot.key === item.slotKey) ? item.slotKey
          : (SLOTS.some(slot => slot.key === item.slot) ? item.slot : 'morning');
        const slotMeta = SLOTS.find(slot => slot.key === slotKey) || SLOTS[0];
        const cat = item.cat || inferItemCat(item, slotKey);
        return {
          name: String(item.name || '').trim() || '自由漫步',
          area: String(item.area || day.area || '市中心').trim(),
          cost: Math.max(0, Math.round(Number(item.cost) || 0)),
          duration: Math.max(30, Math.round(Number(item.duration) || 90)),
          desc: String(item.desc || '').trim(),
          tags: Array.isArray(item.tags) ? item.tags.map(String) : [],
          slot: slotKey,
          slotKey,
          slotLabel: slotMeta.label,
          time: String(item.time || slotMeta.time || ''),
          cat
        };
      });
      day.theme = day.theme || (index === 0 ? '初见城市' : '经典巡礼');
      day.area = day.area || '市中心';
      day.lodging = Math.max(100, Math.round(Number(day.lodging) || 400));
      day.transport = Math.max(0, Math.round(Number(day.transport) || 100));
      day.baseTransport = day.transport;
      return day;
    });
    plan.dayCount = plan.days.length;
    plan.people = Number(plan.people) || form.people || 2;
    plan.budget = Number(plan.budget) || form.budget;
    plan.budgetRange = plan.budgetRange || form.budgetRange;
    plan.prefs = plan.prefs || form.prefs || [];
    plan.notes = plan.notes || form.notes || '';
    plan.crowd = plan.crowd || form.crowd;
    plan.pace = plan.pace || form.pace;
    plan.startDate = plan.startDate || form.startDate;
    plan.endDate = plan.endDate || form.endDate;
    plan.lodging = plan.lodging || { area: '市中心', type: '酒店', price: 400, desc: '市中心住宿，出行方便。', tags: ['交通便利'] };
    plan.summary = plan.summary || {};
    return dedupePlan(plan);
  }

  function sanitizeFilename(name) {
    return String(name || '行程').replace(/[\\/:*?"<>|]/g, '_').trim() || '行程';
  }

  function openAdjustModal(mode) {
    adjustMode = mode;
    const input = $('#adjustInput');
    $('#adjustModalTitle').textContent = mode === 'destination' ? '更换目的地' : '调整出行天数';
    $('#adjustLabel').textContent = mode === 'destination' ? '新目的地' : '新的出行天数';
    input.type = mode === 'destination' ? 'text' : 'number';
    input.min = mode === 'destination' ? '' : 1;
    input.max = mode === 'destination' ? '' : 14;
    input.value = mode === 'destination'
      ? (currentPlan ? currentPlan.destination : $('#destination').value)
      : (currentPlan ? (currentPlan.dayCount || currentPlan.days.length) : $('#days').value);
    $('#adjustHint').textContent = mode === 'destination'
      ? '将保留现有天数、预算、偏好与每日备注，仅替换目的地内容。'
      : '将保留已有日期的合理行程，仅增加或删减天数。';
    $('#adjustModal').hidden = false;
    document.body.style.overflow = 'hidden';
  }

  function closeAdjustModal() {
    $('#adjustModal').hidden = true;
    document.body.style.overflow = '';
  }

  function adjustDays(plan, newDays) {
    const oldCount = plan.dayCount || plan.days.length;
    if (newDays === oldCount) return plan;
    if (newDays < oldCount) {
      plan.days = plan.days.slice(0, newDays);
      } else {
        const form = formFromPlan(plan);
        form.days = newDays;
        const extraPlan = generateItinerary(form);
        plan.days = plan.days.concat(extraPlan.days.slice(oldCount));
      }
      plan = dedupePlan(plan);
      plan.days = plan.days.map((day, index) => ({ ...day, day: index + 1 }));
    plan.dayCount = newDays;
    plan.endDate = plan.startDate ? addDaysToDateStr(plan.startDate, newDays - 1) : plan.endDate;
    plan.risks = validatePlan(plan);
    recomputePlanSummary(plan);
    return plan;
  }

  function confirmAdjust() {
    if (!currentPlan) return;
    if (adjustMode === 'destination') {
      const destination = $('#adjustInput').value.trim();
      if (!destination) {
        showToast('请先输入目的地');
        return;
      }
      if (destination === currentPlan.destination) {
        closeAdjustModal();
        return;
      }
      const form = formFromPlan(currentPlan);
      form.destination = destination;
      const newPlan = generateItinerary(form);
      currentPlan.days.forEach((day, index) => {
        if (newPlan.days[index]) newPlan.days[index].notes = day.notes || '';
      });
      pushContext(`更换目的地：${currentPlan.destination} → ${destination}`);
      currentPlan = newPlan;
      currentPlan.context = contextHistory.slice();
      renderResult(currentPlan);
      persistLastPlan(currentPlan);
      addHistory(currentPlan);
      showToast('已更换目的地，现有天数与备注已保留');
    } else {
      const newDays = clamp(parseInt($('#adjustInput').value, 10) || (currentPlan.dayCount || currentPlan.days.length), 1, 14);
      if (newDays === (currentPlan.dayCount || currentPlan.days.length)) {
        closeAdjustModal();
        return;
      }
      pushContext(`调整天数：${currentPlan.dayCount || currentPlan.days.length} 天 → ${newDays} 天`);
      currentPlan = adjustDays(currentPlan, newDays);
      currentPlan.context = contextHistory.slice();
      $('#days').value = newDays;
      $('#endDate').value = currentPlan.endDate || $('#endDate').value;
      renderResult(currentPlan);
      persistLastPlan(currentPlan);
      addHistory(currentPlan);
      showToast(`已调整为 ${newDays} 天行程`);
    }
    closeAdjustModal();
    saveFormState();
  }

  function handleGenerate() {
    if (isGenerating) return;
    const searchInput = $('#planSearch');
    if (searchInput) searchInput.value = '';
    const searchPanel = $('#searchResults');
    if (searchPanel) searchPanel.hidden = true;
    const form = readForm();
    const error = validateForm(form);
    if (error) {
      showFormError(error);
      return;
    }
    hideFormError();
    lastForm = form;
    isGenerating = true;
    stopRequested = false;
    setGenerateLoading(true);
    (async () => {
      try {
        const steps = LOADING_STEPS;
        for (const step of steps) {
          if (stopRequested) break;
          $('#progressText').textContent = step;
          await delay(380);
        }
        if (stopRequested) {
          showToast('已停止生成');
          return;
        }
        const plan = await generateWithRetry(form, 2);
        await renderStreaming(plan);
        addHistory(plan);
        persistLastPlan(plan);
        saveFormState();
        showToast('行程生成完成');
      } catch (err) {
        console.error(err);
        showToast(friendlyErrorMessage(err));
      } finally {
        setGenerateLoading(false);
        isGenerating = false;
        stopRequested = false;
      }
    })();
  }

  function setGenerateLoading(loading) {
    const button = $('#generateBtn');
    button.classList.toggle('is-loading', loading);
    button.disabled = loading;
    $('#stopBtn').hidden = !loading;
    const progress = $('#progressText');
    progress.hidden = !loading;
    if (!loading) progress.textContent = '';
  }

  function applyTemplate(name) {
    const template = TEMPLATES[name];
    if (!template) return;
    $('#destination').value = template.destination;
    $('#startDate').value = addDaysOffset(template.startOffset);
    $('#endDate').value = addDaysOffset(template.endOffset);
    $('#people').value = template.people;
    $('#days').value = template.days;
    $('#budgetMin').value = template.budgetMin;
    $('#budgetMax').value = template.budgetMax;
    $('#notes').value = template.notes || '';
    setPrefs(template.prefs);
    const crowdInput = document.querySelector('input[name="crowd"][value="情侣"]');
    if (crowdInput) crowdInput.checked = true;
    const paceInput = document.querySelector('input[name="pace"][value="深度打卡"]');
    if (paceInput) paceInput.checked = true;
    updateBudgetNote();
    saveFormState();
  }

  function addItemToDay(dayIndex) {
    const plan = currentPlan;
    if (!plan || !plan.days[dayIndex]) return;
      const day = plan.days[dayIndex];
      const cats = plan.prefs.map(categoryKey).filter(Boolean);
      const cat = cats.length ? cats[Math.floor(Math.random() * cats.length)] : 'sight';
      const used = new Set();
      plan.days.forEach(d => d.items.forEach(item => used.add(item.name + '|' + item.area)));
      const picked = pickFromPool(cityFor(plan), getPool(cityFor(plan), cat), day.area, 'afternoon', used) || walkItem({ key: 'afternoon' }, day.area);
      day.items.push({ ...picked, cat, slotKey: 'afternoon', slotLabel: '下午', time: '13:30 - 17:00' });
      dedupePlan(plan);
      renderResult(plan, { preserveOpen: true, scroll: false });
    schedulePersist();
    showToast('已添加一个项目');
  }

  function deleteItemFromDay(dayIndex, itemIndex) {
    const plan = currentPlan;
    if (!plan || !plan.days[dayIndex]) return;
    plan.days[dayIndex].items.splice(itemIndex, 1);
    renderResult(plan, { preserveOpen: true, scroll: false });
    schedulePersist();
    showToast('已删除项目');
  }

  function initTheme() {
    const saved = localStorage.getItem(STORAGE.theme);
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.dataset.theme = saved || (prefersDark ? 'dark' : 'light');
  }

  function toggleTheme() {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    safeSetItem(STORAGE.theme, next);
  }

  function scrollToEl(element) {
    if (!element) return;
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function openSavedModal() {
    renderSavedList();
    $('#savedModal').hidden = false;
    document.body.style.overflow = 'hidden';
    cloudSyncPlans().then(() => {
      if (!$('#savedModal').hidden) renderSavedList();
    });
  }

  function closeSavedModal() {
    $('#savedModal').hidden = true;
    document.body.style.overflow = '';
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

  let authMode = 'login';

  function hashPassword(password, salt) {
    let seed = 5381;
    const text = salt + ':' + password;
    for (let i = 0; i < text.length; i++) {
      seed = ((seed << 5) + seed + text.charCodeAt(i)) >>> 0;
    }
    return seed.toString(36);
  }

  function getUsers() {
    try {
      const raw = localStorage.getItem(STORAGE.users);
      const users = raw ? JSON.parse(raw) : {};
      return users && typeof users === 'object' ? users : {};
    } catch (err) {
      return {};
    }
  }

  function saveUsers(users) {
    safeSetItem(STORAGE.users, users);
  }

    function currentUser() {
      return localStorage.getItem(STORAGE.session) || '';
  }

  function setSession(name) {
    try {
      localStorage.setItem(STORAGE.session, name);
    } catch (err) {
      /* 会话写入失败时静默降级 */
    }
  }

    function registerUserLocal(username, password) {
      const users = getUsers();
      if (users[username]) return '该用户名已被注册';
    const salt = Math.random().toString(36).slice(2, 10);
    users[username] = { salt, hash: hashPassword(password, salt), createdAt: Date.now() };
    saveUsers(users);
    setSession(username);
    return '';
  }

    function loginUserLocal(username, password) {
      const account = getUsers()[username];
      if (!account) return '用户名不存在';
    if (account.hash !== hashPassword(password, account.salt)) return '密码不正确';
    setSession(username);
    return '';
  }

    function logoutUser() {
      try {
        localStorage.removeItem(STORAGE.session);
        localStorage.removeItem(STORAGE.token);
      } catch (err) {
        /* 忽略 */
      }
      updateSavedBadge();
      updateAuthUI();
      showToast('已退出登录');
    }

  function updateAuthUI() {
    const user = currentUser();
    $('#loginBtn').hidden = Boolean(user);
    $('#userArea').hidden = !user;
    $('#userNameBtn').textContent = user;
  }

  function openLoginModal() {
    authMode = 'login';
    switchAuthMode('login');
    $('#loginModal').hidden = false;
    document.body.style.overflow = 'hidden';
    setTimeout(() => $('#authUsername').focus(), 60);
  }

  function closeLoginModal() {
    $('#loginModal').hidden = true;
    document.body.style.overflow = '';
    hideAuthError();
  }

  function switchAuthMode(mode) {
    authMode = mode;
    const isLogin = mode === 'login';
    $('#loginModalTitle').textContent = isLogin ? '登录路书' : '注册账号';
    $('#authSubmit').textContent = isLogin ? '登录' : '注册并登录';
    document.querySelectorAll('.auth-tab').forEach(tab => {
      tab.classList.toggle('is-active', tab.dataset.authMode === mode);
    });
    hideAuthError();
  }

  function showAuthError(message) {
    const errorEl = $('#authError');
    errorEl.textContent = message;
    errorEl.hidden = false;
  }

  function hideAuthError() {
    $('#authError').hidden = true;
  }

  async function submitAuth() {
    const username = $('#authUsername').value.trim();
    const password = $('#authPassword').value;
    if (!username || !password) {
      showAuthError('请输入用户名和密码');
      return;
    }
    if (username.length > 20) {
      showAuthError('用户名不能超过 20 个字符');
      return;
    }
    if (password.length < 4) {
      showAuthError('密码至少需要 4 位');
      return;
    }
    const submitBtn = $('#authSubmit');
    submitBtn.disabled = true;
    try {
      const path = authMode === 'register' ? '/api/auth/register' : '/api/auth/login';
      const data = await apiFetch(path, {
        method: 'POST',
        body: JSON.stringify({ username, password })
      });
      setToken(data.token);
      setSession(data.username);
      $('#authPassword').value = '';
      closeLoginModal();
      updateAuthUI();
      cloudSyncPlans();
      showToast(authMode === 'register' ? '注册成功，已自动登录' : '登录成功');
    } catch (err) {
      if (err.status && err.status >= 500) {
        showAuthError('服务暂时不可用，请稍后再试');
      } else if (err.status && err.status >= 400 && err.status < 500) {
        showAuthError(err.message);
      } else {
        const localError = authMode === 'register'
          ? registerUserLocal(username, password)
          : loginUserLocal(username, password);
        if (localError) {
          showAuthError(localError);
        } else {
          $('#authPassword').value = '';
          closeLoginModal();
          updateAuthUI();
          showToast('后端未连接，已切换本地模式登录');
        }
      }
    } finally {
      submitBtn.disabled = false;
    }
  }

  function syncDaysFromDates() {
    const days = calcDays($('#startDate').value, $('#endDate').value);
    if (days) $('#days').value = days;
    updateBudgetNote();
    saveFormState();
  }

  function initDragAndDrop() {
    const container = $('#dayCards');
    let dragged = null;

    container.addEventListener('dragstart', event => {
      const item = event.target.closest('.timeline-item[data-item="true"]');
      if (!item || item.getAttribute('draggable') !== 'true') return;
      dragged = {
        dayIndex: Number(item.dataset.day),
        itemIndex: Number(item.dataset.index),
        element: item
      };
      item.classList.add('dragging');
      if (event.dataTransfer) event.dataTransfer.effectAllowed = 'move';
    });

    container.addEventListener('dragend', () => {
      container.querySelectorAll('.dragging, .drag-over').forEach(el => el.classList.remove('dragging', 'drag-over'));
      dragged = null;
    });

    container.addEventListener('dragover', event => {
      if (!dragged) return;
      const target = event.target.closest('.timeline-item');
      if (!target) return;
      event.preventDefault();
      container.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));
      target.classList.add('drag-over');
    });

    container.addEventListener('drop', event => {
      if (!dragged) return;
      const target = event.target.closest('.timeline-item');
      if (!target) return;
      event.preventDefault();
      const targetDay = Number(target.dataset.day);
      const targetIndex = Number(target.dataset.index);
      if (dragged.itemIndex < 0 || targetIndex < 0 || !currentPlan.days[dragged.dayIndex] || !currentPlan.days[targetDay]) return;
      const fromDay = currentPlan.days[dragged.dayIndex];
      const toDay = currentPlan.days[targetDay];
      if (targetDay === dragged.dayIndex) {
        if (targetIndex === dragged.itemIndex) return;
        const [moved] = fromDay.items.splice(dragged.itemIndex, 1);
        fromDay.items.splice(targetIndex, 0, moved);
        showToast('已调整行程顺序');
      } else {
        const allowCross = $('#crossDayDrag') && $('#crossDayDrag').checked;
        if (!allowCross) {
          showToast('跨日拖拽未开启，可在结果区打开开关');
          dragged = null;
          return;
        }
        const [moved] = fromDay.items.splice(dragged.itemIndex, 1);
        toDay.items.splice(targetIndex, 0, moved);
        refreshDayCost(fromDay);
        refreshDayCost(toDay);
        showToast(`已移动到第 ${targetDay + 1} 天`);
      }
      recomputePlanSummary(currentPlan);
      scheduleRefresh();
      dragged = null;
    });
  }

  function init() {
    initTheme();
    renderInspiration();
    restoreFormState();
    if (!$('#startDate').value) $('#startDate').value = addDaysOffset(0);
    if (!$('#endDate').value) $('#endDate').value = addDaysOffset(2);
      updateBudgetNote();
      updateSavedBadge();
      updateAuthUI();
      if (currentUser()) cloudSyncPlans();

      $('#daysMinus').addEventListener('click', () => {
      const input = $('#days');
      input.value = clamp((parseInt(input.value, 10) || 1) - 1, 1, 14);
      updateBudgetNote();
      saveFormState();
    });
    $('#daysPlus').addEventListener('click', () => {
      const input = $('#days');
      input.value = clamp((parseInt(input.value, 10) || 1) + 1, 1, 14);
      updateBudgetNote();
      saveFormState();
    });
    $('#peopleMinus').addEventListener('click', () => {
      const input = $('#people');
      input.value = clamp((parseInt(input.value, 10) || 1) - 1, 1, 20);
      saveFormState();
    });
    $('#peoplePlus').addEventListener('click', () => {
      const input = $('#people');
      input.value = clamp((parseInt(input.value, 10) || 1) + 1, 1, 20);
      saveFormState();
    });
    $('#days').addEventListener('input', () => {
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
    $('#notes').addEventListener('input', saveFormState);
    $('#destination').addEventListener('input', saveFormState);
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
    $('#startDate').addEventListener('change', syncDaysFromDates);
    $('#endDate').addEventListener('change', syncDaysFromDates);

    $('#plannerForm').addEventListener('submit', event => {
      event.preventDefault();
      handleGenerate();
    });

    $('#stopBtn').addEventListener('click', () => {
      stopRequested = true;
      showToast('正在停止生成…');
    });

    document.querySelectorAll('.template-chip').forEach(button => {
      button.addEventListener('click', () => {
        applyTemplate(button.dataset.template);
        showToast('已填入快捷模板，可以继续调整');
      });
    });
    $('#heroStart').addEventListener('click', () => scrollToEl($('#planner')));
    $('#navPlan').addEventListener('click', () => scrollToEl($('#planner')));

    $('#themeToggle').addEventListener('click', toggleTheme);

      $('#navSaved').addEventListener('click', openSavedModal);
      $('#loginBtn').addEventListener('click', openLoginModal);
      $('#logoutBtn').addEventListener('click', logoutUser);
      $('#loginClose').addEventListener('click', closeLoginModal);
      $('#loginModal').addEventListener('click', event => {
        if (event.target === $('#loginModal')) closeLoginModal();
      });
      $('#authSubmit').addEventListener('click', submitAuth);
      document.querySelectorAll('.auth-tab').forEach(tab => {
        tab.addEventListener('click', () => switchAuthMode(tab.dataset.authMode));
      });
      $('#authUsername').addEventListener('keydown', event => {
        if (event.key === 'Enter') submitAuth();
      });
      $('#authPassword').addEventListener('keydown', event => {
        if (event.key === 'Enter') submitAuth();
      });
      $('#savedClose').addEventListener('click', closeSavedModal);
    $('#savedModal').addEventListener('click', event => {
      if (event.target === $('#savedModal')) closeSavedModal();
    });

    $('#savePlanBtn').addEventListener('click', saveCurrentPlan);
    $('#resultSummary').addEventListener('click', event => {
        if (event.target.closest('#switchLodgingBtn')) switchLodging();
      });
    $('#regenerateBtn').addEventListener('click', handleGenerate);
    $('#changeDestBtn').addEventListener('click', () => openAdjustModal('destination'));
    $('#changeDaysBtn').addEventListener('click', () => openAdjustModal('days'));
    $('#adjustClose').addEventListener('click', closeAdjustModal);
    $('#adjustCancel').addEventListener('click', closeAdjustModal);
    $('#adjustConfirm').addEventListener('click', confirmAdjust);
    $('#adjustModal').addEventListener('click', event => {
      if (event.target === $('#adjustModal')) closeAdjustModal();
    });
      $('#planSearch').addEventListener('input', applyPlanSearch);
      $('#planSearch').addEventListener('focus', applyPlanSearch);
      $('#planSearch').addEventListener('blur', () => {
        setTimeout(() => {
          const panel = $('#searchResults');
          if (panel && !panel.contains(document.activeElement)) panel.hidden = true;
        }, 160);
      });
      $('#searchResults').addEventListener('click', event => {
        const btn = event.target.closest('[data-search-day]');
        if (!btn) return;
        const dayIndex = Number(btn.dataset.searchDay);
        const itemIndex = Number(btn.dataset.searchIndex);
        const card = document.querySelector(`.day-card[data-day="${dayIndex}"]`);
        if (!card) return;
        card.open = true;
        const item = card.querySelector(`.timeline-item[data-day="${dayIndex}"][data-index="${itemIndex}"]`);
        if (item) {
          item.scrollIntoView({ behavior: 'smooth', block: 'center' });
          item.classList.add('is-search-hit');
          setTimeout(() => item.classList.remove('is-search-hit'), 2200);
        } else {
          card.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        $('#searchResults').hidden = true;
      });

      $('#dayCards').addEventListener('click', event => {
      const doneBtn = event.target.closest('.item-done');
      if (doneBtn) {
        const dayIndex = Number(doneBtn.dataset.day);
        const itemIndex = Number(doneBtn.dataset.index);
        if (currentPlan && currentPlan.days[dayIndex] && currentPlan.days[dayIndex].items[itemIndex]) {
          const item = currentPlan.days[dayIndex].items[itemIndex];
          item.done = !item.done;
          renderResult(currentPlan, { preserveOpen: true, scroll: false });
          schedulePersist();
        }
        return;
      }
      const copyDayBtn = event.target.closest('[data-copy-day]');
      if (copyDayBtn) {
        copySingleDay(Number(copyDayBtn.dataset.copyDay));
        return;
      }
      const copyItemBtn = event.target.closest('[data-copy-item]');
      if (copyItemBtn) {
        copySingleItem(Number(copyItemBtn.dataset.day), Number(copyItemBtn.dataset.copyItem));
        return;
      }
      const localBtn = event.target.closest('[data-local-day]');
      if (localBtn) {
        localOptimizeDay(Number(localBtn.dataset.localDay));
        return;
      }
      const expandBtn = event.target.closest('[data-expand-day]');
      if (expandBtn) {
        const dayIndex = Number(expandBtn.dataset.expandDay);
        if (currentPlan && currentPlan.days[dayIndex]) {
          currentPlan.days[dayIndex]._expanded = true;
          renderResult(currentPlan, { preserveOpen: true, scroll: false });
        }
        return;
      }
      const deleteBtn = event.target.closest('.item-delete');
      if (deleteBtn) {
        deleteItemFromDay(Number(deleteBtn.dataset.day), Number(deleteBtn.dataset.index));
        return;
      }
      const addBtn = event.target.closest('.add-item-btn');
      if (addBtn) addItemToDay(Number(addBtn.dataset.day));
    });

    $('#dayCards').addEventListener('input', event => {
      const note = event.target.closest('[data-day-note]');
      if (note && currentPlan) {
        const dayIndex = Number(note.dataset.dayNote);
        if (currentPlan.days[dayIndex]) {
          currentPlan.days[dayIndex].notes = note.value;
          schedulePersist();
        }
      }
    });

    $('#dayCards').addEventListener('change', event => {
      const transport = event.target.closest('[data-transport-mode]');
      if (transport && currentPlan) {
        const dayIndex = Number(transport.dataset.transportMode);
        const day = currentPlan.days[dayIndex];
        if (day) {
          const mode = transport.value;
          currentPlan.transportMode = currentPlan.transportMode || {};
          currentPlan.transportMode[dayIndex] = mode;
          const factor = mode === 'taxi' ? 2.2 : 0.8;
          day.transport = Math.max(20, Math.round((day.baseTransport || day.transport) * factor / 10) * 10);
          refreshDayCost(day);
          recomputePlanSummary(currentPlan);
          renderResult(currentPlan, { preserveOpen: true, scroll: false });
          schedulePersist();
          showToast(mode === 'taxi' ? '已切换为打车，交通预估已更新' : '已切换为公共交通，交通预估已更新');
        }
        return;
      }
      const book = event.target.closest('[data-book-item]');
      if (book && currentPlan) {
        const dayIndex = Number(book.dataset.day);
        const itemIndex = Number(book.dataset.bookItem);
        const item = currentPlan.days[dayIndex] && currentPlan.days[dayIndex].items[itemIndex];
        if (item) {
          item.booked = book.checked;
          refreshDayCost(currentPlan.days[dayIndex]);
          recomputePlanSummary(currentPlan);
          renderResult(currentPlan, { preserveOpen: true, scroll: false });
          schedulePersist();
          showToast(book.checked ? '已标记预订，预估费用已更新' : '已取消预订标记');
        }
      }
    });

    initDragAndDrop();
    restoreLastPlan();

    $('#backTop').addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    window.addEventListener('scroll', () => {
      $('#backTop').hidden = window.scrollY < 400;
    }, { passive: true });

    document.addEventListener('focusin', event => {
      const el = event.target;
      if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') && window.matchMedia && window.matchMedia('(pointer: coarse)').matches) {
        setTimeout(() => el.scrollIntoView({ block: 'center', behavior: 'smooth' }), 120);
      }
    });

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        closeSavedModal();
        closeAdjustModal();
        closeHistoryModal();
      }
    });
  }

  init();
})();
