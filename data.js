(function () {
  'use strict';

  // 城市中心坐标，用于地图视野与通用区域定位
  window.LUSHU_CITY_CENTERS = {
    '成都': [30.6600, 104.0630],
    '杭州': [30.2740, 120.1550],
    '重庆': [29.5630, 106.5520],
    '西安': [34.3420, 108.9400],
    '厦门': [24.4800, 118.0890],
    '大理': [25.6065, 100.2676],
    '青岛': [36.0670, 120.3830],
    '上海': [31.2304, 121.4737],
    '北京': [39.9042, 116.4074],
    '广州': [23.1291, 113.2644],
    '深圳': [22.5431, 114.0579],
    '苏州': [31.2989, 120.5853],
    '南京': [32.0603, 118.7969],
    '长沙': [28.2282, 112.9388],
    '武汉': [30.5928, 114.3055],
    '桂林': [25.2736, 110.2900],
    '丽江': [26.8721, 100.2299],
    '三亚': [18.2528, 109.5119],
    '哈尔滨': [45.8038, 126.5350],
    '洛阳': [34.6181, 112.4540]
  };

  // 区域中心坐标：lat, lng。POI 会在此基础上做微小抖动，避免标记重叠
  window.LUSHU_AREA_COORDS = {
    '成都': { '玉林路': [30.6310, 104.0630], '宽窄巷子': [30.6690, 104.0570], '东郊记忆': [30.6630, 104.1230], '人民公园': [30.6610, 104.0580], '建设路': [30.6770, 104.0980] },
    '杭州': { '西湖东线': [30.2500, 120.1630], '西湖西线': [30.2400, 120.1330], '灵隐': [30.2400, 120.0990], '运河': [30.3180, 120.1400], '龙井': [30.2180, 120.1110] },
    '重庆': { '渝中半岛': [29.5620, 106.5780], '南滨路': [29.5650, 106.5900], '磁器口': [29.5810, 106.4520], '南山': [29.5440, 106.6140], '观音桥': [29.5830, 106.5350] },
    '西安': { '城墙·南门': [34.2540, 108.9420], '大雁塔': [34.2190, 108.9640], '碑林': [34.2550, 108.9500], '临潼': [34.3800, 109.2200], '回民街': [34.2650, 108.9410] },
    '厦门': { '鼓浪屿': [24.4470, 118.0650], '沙坡尾': [24.4440, 118.0860], '环岛路': [24.4210, 118.1370], '中山路': [24.4550, 118.0780], '集美': [24.5680, 118.1000] },
    '大理': { '大理古城': [25.6910, 100.1570], '洱海西岸': [25.7100, 100.1800], '双廊': [25.9240, 100.2640], '喜洲': [25.8540, 100.1450], '苍山': [25.6780, 100.1050] },
    '青岛': { '老城·栈桥': [36.0580, 120.3190], '八大关': [36.0580, 120.3470], '奥帆中心': [36.0650, 120.3830], '崂山': [36.1660, 120.6160], '台东': [36.0810, 120.3570] },
    '上海': { '外滩': [31.2400, 121.4900], '武康路': [31.2080, 121.4390], '豫园': [31.2270, 121.4920], '陆家嘴': [31.2400, 121.5000], '徐汇滨江': [31.1850, 121.4600], '人民广场': [31.2300, 121.4730] },
    '北京': { '前门·大栅栏': [39.8994, 116.3976], '故宫·东华门': [39.9186, 116.4052], '什刹海': [39.9400, 116.3860], '798 艺术区': [39.9849, 116.4953], '颐和园': [39.9999, 116.2755] },
    '广州': { '越秀公园': [23.1399, 113.2701], '北京路': [23.1209, 113.2680], '沙面': [23.1092, 113.2408], '珠江新城': [23.1192, 113.3241], '白云山': [23.1843, 113.2973] },
    '深圳': { '福田中心': [22.5431, 114.0579], '华侨城': [22.5361, 113.9905], '南山': [22.5333, 113.9304], '盐田海滨': [22.5565, 114.2381], '大鹏半岛': [22.5955, 114.4900] },
    '苏州': { '平江路': [31.3149, 120.6321], '拙政园': [31.3243, 120.6279], '金鸡湖': [31.3156, 120.6974], '虎丘': [31.3381, 120.5780], '山塘街': [31.3104, 120.5988] },
    '南京': { '夫子庙': [32.0206, 118.7876], '老门东': [32.0100, 118.7900], '中山陵': [32.0594, 118.8480], '玄武湖': [32.0773, 118.8013], '颐和路': [32.0613, 118.7712] },
    '长沙': { '五一广场': [28.1955, 112.9735], '太平街': [28.1944, 112.9720], '岳麓山': [28.1906, 112.9341], '橘子洲': [28.1953, 112.9581], '湖南博物院': [28.2147, 113.0065] },
    '武汉': { '黄鹤楼': [30.5434, 114.2990], '户部巷': [30.5450, 114.3010], '江汉路': [30.5860, 114.2880], '东湖': [30.5536, 114.4010], '昙华林': [30.5520, 114.3140] },
    '桂林': { '象鼻山': [25.2680, 110.2910], '两江四湖': [25.2740, 110.2950], '阳朔': [24.7780, 110.4960], '兴坪': [24.9070, 110.5300], '龙脊梯田': [25.7400, 110.1200] },
    '丽江': { '丽江古城': [26.8721, 100.2299], '束河古镇': [26.8910, 100.2190], '玉龙雪山': [27.0981, 100.1750], '蓝月谷': [27.0700, 100.2000], '拉市海': [26.8000, 100.1200] },
    '三亚': { '大东海': [18.2140, 109.5160], '亚龙湾': [18.2100, 109.6390], '天涯海角': [18.2920, 109.3290], '蜈支洲岛': [18.3050, 109.7590], '海棠湾': [18.3810, 109.7610] },
    '哈尔滨': { '中央大街': [45.7710, 126.6190], '圣索菲亚': [45.7680, 126.6200], '老道外': [45.7750, 126.6400], '太阳岛': [45.7840, 126.5850], '冰雪大世界': [45.8100, 126.5750] },
    '洛阳': { '龙门石窟': [34.5550, 112.4700], '白马寺': [34.7220, 112.5980], '丽景门': [34.6770, 112.4560], '洛阳博物馆': [34.6550, 112.4200], '老君山': [33.8400, 111.5600] }
  };

  window.LUSHU_CITIES = [
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
    },

    {
      name: '北京',
      region: '北京',
      tagline: '古都气象',
      image: 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=900&q=80',
      areas: [{ name: '前门·大栅栏', lat: 39.8994, lng: 116.3976 }, { name: '故宫·东华门', lat: 39.9186, lng: 116.4052 }, { name: '什刹海', lat: 39.9400, lng: 116.3860 }, { name: '798 艺术区', lat: 39.9849, lng: 116.4953 }, { name: '颐和园', lat: 39.9999, lng: 116.2755 }],
      food: [
        { name: '前门老字号早点', area: '前门·大栅栏', cost: 25, duration: 45, desc: '豆浆、焦圈、糖火烧，老北京的一天从这里开始。', tags: ['早餐', '老字号'], slot: 'morning' },
        { name: '牛街清真小吃', area: '前门·大栅栏', cost: 60, duration: 90, desc: '豌豆黄、驴打滚、酱牛肉，清真小吃很集中。', tags: ['小吃', '清真'], slot: 'lunch' },
        { name: '什刹海铜锅涮肉', area: '什刹海', cost: 150, duration: 120, desc: '清汤铜锅配手切羊肉，湖边暖融融。', tags: ['涮肉', '夜宵'], slot: 'dinner' },
        { name: '烤鸭老店', area: '前门·大栅栏', cost: 180, duration: 100, desc: '果木烤鸭配荷叶饼，游客和本地人都爱。', tags: ['烤鸭', '经典'], slot: 'lunch' },
        { name: '798 咖啡馆', area: '798 艺术区', cost: 55, duration: 90, desc: '美术馆逛累了，找个厂房咖啡馆歇脚。', tags: ['咖啡', '艺术'], slot: 'afternoon' }
      ],
      sight: [
        { name: '天安门广场', area: '前门·大栅栏', cost: 0, duration: 90, desc: '中轴线起点，看升旗记得早起。', tags: ['地标', '免费'], slot: 'morning' },
        { name: '故宫博物院', area: '故宫·东华门', cost: 60, duration: 240, desc: '沿中轴线穿行三大殿，珍宝馆值得加票。', tags: ['历史', '门票'], slot: 'any' },
        { name: '景山公园', area: '故宫·东华门', cost: 2, duration: 90, desc: '登万春亭俯瞰紫禁城全景。', tags: ['俯瞰', '便宜'], slot: 'afternoon' },
        { name: '颐和园', area: '颐和园', cost: 30, duration: 210, desc: '昆明湖泛舟，长廊慢走，皇家园林的松弛感。', tags: ['皇家园林', '门票'], slot: 'any' },
        { name: '国家博物馆', area: '故宫·东华门', cost: 0, duration: 180, desc: '镇馆之宝目不暇接，记得提前预约。', tags: ['博物馆', '免费'], slot: 'any' }
      ],
      photo: [
        { name: '角楼日出', area: '故宫·东华门', cost: 0, duration: 60, desc: '护城河与角楼同框，经典机位要赶早。', tags: ['日出', '免费'], slot: 'morning' },
        { name: '南锣鼓巷', area: '什刹海', cost: 0, duration: 120, desc: '胡同、灰瓦与树影，适合扫街。', tags: ['胡同', '街拍'], slot: 'afternoon' },
        { name: '什刹海日落', area: '什刹海', cost: 0, duration: 90, desc: '湖面倒映鼓楼，黄昏光线最温柔。', tags: ['日落', '免费'], slot: 'evening' },
        { name: '故宫红墙光影', area: '故宫·东华门', cost: 0, duration: 90, desc: '红墙金瓦与树影，随手就是古都大片。', tags: ['红墙', '免费'], slot: 'morning' }
      ]
    },
    {
      name: '广州',
      region: '广东',
      tagline: '食在广州',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=900&q=80',
      areas: [{ name: '越秀公园', lat: 23.1399, lng: 113.2701 }, { name: '北京路', lat: 23.1209, lng: 113.2680 }, { name: '沙面', lat: 23.1092, lng: 113.2408 }, { name: '珠江新城', lat: 23.1192, lng: 113.3241 }, { name: '白云山', lat: 23.1843, lng: 113.2973 }],
      food: [
        { name: '银记肠粉', area: '北京路', cost: 22, duration: 45, desc: '鲜虾肠粉配酱油，皮薄滑嫩。', tags: ['早餐', '肠粉'], slot: 'morning' },
        { name: '广州酒家早茶', area: '北京路', cost: 90, duration: 120, desc: '虾饺、烧卖、凤爪，一盅两件坐半天。', tags: ['早茶', '经典'], slot: 'morning' },
        { name: '沙面咖啡馆', area: '沙面', cost: 55, duration: 90, desc: '欧陆建筑下的咖啡，逛累了刚好歇脚。', tags: ['咖啡', '欧陆'], slot: 'afternoon' },
        { name: '上下九牛杂', area: '北京路', cost: 35, duration: 60, desc: '萝卜牛杂热腾腾，老广味很浓。', tags: ['小吃', '牛杂'], slot: 'afternoon' },
        { name: '珠江夜宵', area: '珠江新城', cost: 110, duration: 120, desc: '江边大排档吃砂锅粥和椒盐虾。', tags: ['夜宵', '海鲜'], slot: 'evening' }
      ],
      sight: [
        { name: '陈家祠', area: '越秀公园', cost: 10, duration: 120, desc: '岭南建筑与灰塑工艺的巅峰之作。', tags: ['岭南', '建筑'], slot: 'any' },
        { name: '越秀公园五羊石像', area: '越秀公园', cost: 0, duration: 90, desc: '广州城标五羊石像，登镇海楼看全城。', tags: ['地标', '免费'], slot: 'morning' },
        { name: '广州塔', area: '珠江新城', cost: 150, duration: 120, desc: '登塔看珠江夜景，晴天才值回票价。', tags: ['地标', '夜景'], slot: 'evening' },
        { name: '沙面建筑群', area: '沙面', cost: 0, duration: 120, desc: '百年租界建筑与古树，安静又好逛。', tags: ['建筑', '免费'], slot: 'afternoon' },
        { name: '中山纪念堂', area: '越秀公园', cost: 10, duration: 90, desc: '八角形宫殿式建筑，纪念堂前广场开阔。', tags: ['历史', '门票'], slot: 'any' }
      ],
      photo: [
        { name: '广州塔夜景', area: '珠江新城', cost: 0, duration: 90, desc: '花城广场拍小蛮腰，灯光亮起最出片。', tags: ['夜景', '免费'], slot: 'evening' },
        { name: '圣心大教堂', area: '北京路', cost: 0, duration: 60, desc: '哥特式双塔，午后光线穿过彩色玻璃。', tags: ['教堂', '免费'], slot: 'afternoon' },
        { name: '沙面街拍', area: '沙面', cost: 0, duration: 90, desc: '欧陆建筑与绿树，人像大片率很高。', tags: ['街拍', '免费'], slot: 'morning' },
        { name: '珠江新城日落', area: '珠江新城', cost: 0, duration: 90, desc: '江边步道看日落与城市天际线。', tags: ['日落', '免费'], slot: 'evening' }
      ]
    },
    {
      name: '深圳',
      region: '广东',
      tagline: '海岸与创新',
      image: 'https://images.unsplash.com/photo-1465447142348-e9952c393450?auto=format&fit=crop&w=900&q=80',
      areas: [{ name: '福田中心', lat: 22.5431, lng: 114.0579 }, { name: '华侨城', lat: 22.5361, lng: 113.9905 }, { name: '南山', lat: 22.5333, lng: 113.9304 }, { name: '盐田海滨', lat: 22.5565, lng: 114.2381 }, { name: '大鹏半岛', lat: 22.5955, lng: 114.4900 }],
      food: [
        { name: '华强北猪脚饭', area: '福田中心', cost: 25, duration: 45, desc: '肥而不腻的猪脚饭，打工人的治愈午餐。', tags: ['简餐', '便宜'], slot: 'lunch' },
        { name: '东门小吃', area: '福田中心', cost: 50, duration: 90, desc: '烤肠、章鱼小丸子、糖水，老深圳味道。', tags: ['小吃', '老街'], slot: 'afternoon' },
        { name: '蛇口海鲜', area: '南山', cost: 150, duration: 120, desc: '渔人码头附近现挑现做，海风配海鲜。', tags: ['海鲜', '海边'], slot: 'dinner' },
        { name: '华侨城咖啡馆', area: '华侨城', cost: 55, duration: 90, desc: '创意园里的独立咖啡，逛展间隙休息。', tags: ['咖啡', '创意'], slot: 'afternoon' },
        { name: '海上世界夜宵', area: '南山', cost: 100, duration: 120, desc: '明华轮下的餐厅与酒吧，夜色热闹。', tags: ['夜宵', '夜景'], slot: 'evening' }
      ],
      sight: [
        { name: '深圳湾公园', area: '福田中心', cost: 0, duration: 120, desc: '沿海绿道看城市与候鸟，傍晚最舒服。', tags: ['公园', '免费'], slot: 'any' },
        { name: '世界之窗', area: '华侨城', cost: 220, duration: 240, desc: '浓缩全球地标，适合第一次来玩。', tags: ['主题公园', '门票'], slot: 'any' },
        { name: '莲花山公园', area: '福田中心', cost: 0, duration: 120, desc: '登顶看福田天际线，山顶草坪开阔。', tags: ['公园', '免费'], slot: 'any' },
        { name: '大梅沙海滨公园', area: '盐田海滨', cost: 0, duration: 180, desc: '免费沙滩与海滨栈道，夏天人很多。', tags: ['海边', '免费'], slot: 'any' },
        { name: '中英街', area: '盐田海滨', cost: 0, duration: 90, desc: '一街两制的历史街区，需办证进入。', tags: ['历史', '街市'], slot: 'any' }
      ],
      photo: [
        { name: '深圳湾日落', area: '福田中心', cost: 0, duration: 90, desc: '对岸香港山影与城市轮廓，日落很美。', tags: ['日落', '免费'], slot: 'evening' },
        { name: '华侨城创意园', area: '华侨城', cost: 0, duration: 120, desc: '旧厂房改造，涂鸦与工业风都出片。', tags: ['文创', '免费'], slot: 'afternoon' },
        { name: '盐田海滨栈道', area: '盐田海滨', cost: 0, duration: 120, desc: '栈道沿海而建，蓝天碧海很通透。', tags: ['海景', '免费'], slot: 'morning' },
        { name: '海上世界夜景', area: '南山', cost: 0, duration: 90, desc: '明华轮灯光与水面倒影，夜拍氛围好。', tags: ['夜景', '免费'], slot: 'evening' }
      ]
    },
    {
      name: '苏州',
      region: '江苏',
      tagline: '园林水乡',
      image: 'https://images.unsplash.com/photo-1515586838455-8f8f940d6853?auto=format&fit=crop&w=900&q=80',
      areas: [{ name: '平江路', lat: 31.3149, lng: 120.6321 }, { name: '拙政园', lat: 31.3243, lng: 120.6279 }, { name: '金鸡湖', lat: 31.3156, lng: 120.6974 }, { name: '虎丘', lat: 31.3381, lng: 120.5780 }, { name: '山塘街', lat: 31.3104, lng: 120.5988 }],
      food: [
        { name: '哑巴生煎', area: '平江路', cost: 25, duration: 45, desc: '皮薄底脆，肉馅带汤，趁热吃。', tags: ['生煎', '早餐'], slot: 'morning' },
        { name: '苏州头汤面', area: '平江路', cost: 35, duration: 60, desc: '红汤焖肉面，汤清味鲜。', tags: ['面食', '苏式'], slot: 'morning' },
        { name: '平江路糖粥', area: '平江路', cost: 15, duration: 45, desc: '桂花赤豆糖粥，甜而不腻。', tags: ['甜品', '小吃'], slot: 'afternoon' },
        { name: '山塘街桂花糕', area: '山塘街', cost: 20, duration: 45, desc: '现蒸桂花糕，糯香十足。', tags: ['小吃', '糕点'], slot: 'afternoon' },
        { name: '金鸡湖苏帮菜', area: '金鸡湖', cost: 140, duration: 100, desc: '松鼠桂鱼、响油鳝糊，湖景配本帮味。', tags: ['苏帮菜', '湖景'], slot: 'lunch' }
      ],
      sight: [
        { name: '拙政园', area: '拙政园', cost: 80, duration: 180, desc: '苏州园林之首，四季景致各不相同。', tags: ['园林', '门票'], slot: 'any' },
        { name: '苏州博物馆', area: '拙政园', cost: 0, duration: 150, desc: '贝聿铭设计，建筑本身就是展品。', tags: ['博物馆', '建筑'], slot: 'any' },
        { name: '虎丘', area: '虎丘', cost: 70, duration: 150, desc: '云岩寺塔与剑池，吴中第一胜景。', tags: ['古塔', '门票'], slot: 'any' },
        { name: '平江路', area: '平江路', cost: 0, duration: 120, desc: '小桥流水人家，沿河慢走最惬意。', tags: ['水乡', '免费'], slot: 'any' },
        { name: '寒山寺', area: '山塘街', cost: 20, duration: 120, desc: '枫桥夜泊处，钟声悠远。', tags: ['寺庙', '门票'], slot: 'any' }
      ],
      photo: [
        { name: '平江路晨光', area: '平江路', cost: 0, duration: 60, desc: '清晨人少，白墙黛瓦倒映河里。', tags: ['水乡', '免费'], slot: 'morning' },
        { name: '山塘街夜景', area: '山塘街', cost: 0, duration: 90, desc: '红灯笼亮起来，七里山塘夜色迷人。', tags: ['夜景', '免费'], slot: 'evening' },
        { name: '金鸡湖日落', area: '金鸡湖', cost: 0, duration: 90, desc: '摩天轮与湖面日落，现代苏州的一面。', tags: ['日落', '免费'], slot: 'evening' },
        { name: '拙政园四季', area: '拙政园', cost: 0, duration: 90, desc: '框景借景，园林处处都是构图。', tags: ['园林', '门票'], slot: 'any' }
      ]
    },
    {
      name: '南京',
      region: '江苏',
      tagline: '六朝古都',
      image: 'https://images.unsplash.com/photo-1518829047978-4e4e5c2e37c9?auto=format&fit=crop&w=900&q=80',
      areas: [{ name: '夫子庙', lat: 32.0206, lng: 118.7876 }, { name: '老门东', lat: 32.0100, lng: 118.7900 }, { name: '中山陵', lat: 32.0594, lng: 118.8480 }, { name: '玄武湖', lat: 32.0773, lng: 118.8013 }, { name: '颐和路', lat: 32.0613, lng: 118.7712 }],
      food: [
        { name: '鸭血粉丝汤', area: '夫子庙', cost: 25, duration: 45, desc: '鸭血、鸭肠配粉丝，汤头醇厚。', tags: ['鸭血', '小吃'], slot: 'morning' },
        { name: '鸡鸣汤包', area: '夫子庙', cost: 28, duration: 45, desc: '皮薄汁多的鸡汁汤包，配醋最香。', tags: ['汤包', '早餐'], slot: 'morning' },
        { name: '夫子庙小吃', area: '夫子庙', cost: 45, duration: 90, desc: '糖芋苗、状元豆、鸭油酥烧饼一路吃。', tags: ['小吃', '老街'], slot: 'afternoon' },
        { name: '狮子桥夜宵', area: '玄武湖', cost: 90, duration: 120, desc: '小龙虾与烧烤，夏天烟火气很足。', tags: ['夜宵', '热闹'], slot: 'evening' },
        { name: '老门东传统菜', area: '老门东', cost: 130, duration: 100, desc: '盐水鸭、熏鱼、炒芦蒿，金陵风味。', tags: ['金陵菜', '经典'], slot: 'lunch' }
      ],
      sight: [
        { name: '中山陵', area: '中山陵', cost: 0, duration: 180, desc: '392 级台阶仰望钟山，庄严肃穆。', tags: ['历史', '免费'], slot: 'any' },
        { name: '明孝陵', area: '中山陵', cost: 70, duration: 180, desc: '明太祖陵寝，神道石象路四季皆美。', tags: ['世界遗产', '门票'], slot: 'any' },
        { name: '南京博物院', area: '中山陵', cost: 0, duration: 180, desc: '民国馆沉浸式穿越，需提前预约。', tags: ['博物馆', '免费'], slot: 'any' },
        { name: '总统府', area: '夫子庙', cost: 35, duration: 150, desc: '近代史浓缩地，园林与洋楼并存。', tags: ['历史', '门票'], slot: 'any' },
        { name: '玄武湖', area: '玄武湖', cost: 0, duration: 150, desc: '明城墙下的城中湖，划船看夕阳。', tags: ['湖景', '免费'], slot: 'any' }
      ],
      photo: [
        { name: '玄武湖日落', area: '玄武湖', cost: 0, duration: 90, desc: '城墙、湖面与城市天际线同框。', tags: ['日落', '免费'], slot: 'evening' },
        { name: '颐和路梧桐', area: '颐和路', cost: 0, duration: 90, desc: '民国公馆与梧桐大道，秋日最美。', tags: ['梧桐', '街拍'], slot: 'afternoon' },
        { name: '老门东灯笼', area: '老门东', cost: 0, duration: 90, desc: '徽派建筑配红灯笼，夜拍古韵。', tags: ['夜景', '免费'], slot: 'evening' },
        { name: '紫峰大厦夜景', area: '玄武湖', cost: 0, duration: 60, desc: '摩天楼与六朝古韵的现代同框。', tags: ['夜景', '免费'], slot: 'evening' }
      ]
    },
    {
      name: '长沙',
      region: '湖南',
      tagline: '星城烟火',
      image: 'https://images.unsplash.com/photo-1545249390-6bdfa286032f?auto=format&fit=crop&w=900&q=80',
      areas: [{ name: '五一广场', lat: 28.1955, lng: 112.9735 }, { name: '太平街', lat: 28.1944, lng: 112.9720 }, { name: '岳麓山', lat: 28.1906, lng: 112.9341 }, { name: '橘子洲', lat: 28.1953, lng: 112.9581 }, { name: '湖南博物院', lat: 28.2147, lng: 113.0065 }],
      food: [
        { name: '长沙米粉', area: '五一广场', cost: 15, duration: 45, desc: '扁粉配码子，剁椒一拌就开吃。', tags: ['早餐', '米粉'], slot: 'morning' },
        { name: '黑色经典臭豆腐', area: '太平街', cost: 15, duration: 45, desc: '外酥里嫩灌辣汁，闻着臭吃着香。', tags: ['小吃', '必吃'], slot: 'afternoon' },
        { name: '茶颜悦色', area: '五一广场', cost: 18, duration: 30, desc: '幽兰拿铁配奶油顶，长沙限定快乐。', tags: ['奶茶', '网红'], slot: 'afternoon' },
        { name: '文和友小龙虾', area: '太平街', cost: 150, duration: 120, desc: '老长沙街景里的口味虾，热闹过瘾。', tags: ['小龙虾', '夜宵'], slot: 'dinner' },
        { name: '坡子街夜宵', area: '太平街', cost: 80, duration: 100, desc: '糖油粑粑、刮凉粉、烧烤一网打尽。', tags: ['夜宵', '老街'], slot: 'evening' }
      ],
      sight: [
        { name: '岳麓书院', area: '岳麓山', cost: 50, duration: 150, desc: '千年学府，爱晚亭就在旁边。', tags: ['书院', '历史'], slot: 'any' },
        { name: '橘子洲', area: '橘子洲', cost: 0, duration: 180, desc: '湘江中绿洲，青年毛泽东雕像气势足。', tags: ['江景', '免费'], slot: 'any' },
        { name: '湖南博物院', area: '湖南博物院', cost: 0, duration: 180, desc: '马王堆汉墓与辛追夫人，需预约。', tags: ['博物馆', '免费'], slot: 'any' },
        { name: '天心阁', area: '五一广场', cost: 32, duration: 90, desc: '古城墙上的楼阁，俯瞰老城区。', tags: ['古建', '门票'], slot: 'any' },
        { name: '杜甫江阁', area: '橘子洲', cost: 12, duration: 90, desc: '湘江边的仿古楼阁，看江景不错。', tags: ['江景', '门票'], slot: 'any' }
      ],
      photo: [
        { name: '橘子洲江景', area: '橘子洲', cost: 0, duration: 90, desc: '湘江两岸天际线，傍晚光线最好。', tags: ['江景', '免费'], slot: 'evening' },
        { name: '岳麓山红叶', area: '岳麓山', cost: 0, duration: 120, desc: '秋季爱晚亭红叶，层林尽染。', tags: ['红叶', '免费'], slot: 'afternoon' },
        { name: '文和友街景', area: '太平街', cost: 0, duration: 90, desc: '复古老长沙街景，随手一拍都是年代感。', tags: ['复古', '免费'], slot: 'evening' },
        { name: '五一广场夜景', area: '五一广场', cost: 0, duration: 60, desc: '霓虹与人群，星城夜晚的活力。', tags: ['夜景', '免费'], slot: 'evening' }
      ]
    },
    {
      name: '武汉',
      region: '湖北',
      tagline: '江城江湖',
      image: 'https://images.unsplash.com/photo-1531907700752-62799b2a3e84?auto=format&fit=crop&w=900&q=80',
      areas: [{ name: '黄鹤楼', lat: 30.5434, lng: 114.2990 }, { name: '户部巷', lat: 30.5450, lng: 114.3010 }, { name: '江汉路', lat: 30.5860, lng: 114.2880 }, { name: '东湖', lat: 30.5536, lng: 114.4010 }, { name: '昙华林', lat: 30.5520, lng: 114.3140 }],
      food: [
        { name: '热干面', area: '户部巷', cost: 8, duration: 30, desc: '芝麻酱拌碱面，武汉人早上的灵魂。', tags: ['早餐', '便宜'], slot: 'morning' },
        { name: '三鲜豆皮', area: '户部巷', cost: 12, duration: 30, desc: '糯米配豆干鲜肉，金黄酥脆。', tags: ['早餐', '小吃'], slot: 'morning' },
        { name: '户部巷小吃', area: '户部巷', cost: 50, duration: 90, desc: '糊汤粉、面窝、糯米包油条一路吃。', tags: ['小吃', '老街'], slot: 'afternoon' },
        { name: '武昌鱼', area: '黄鹤楼', cost: 120, duration: 100, desc: '清蒸武昌鱼，鲜嫩少刺。', tags: ['湖北菜', '经典'], slot: 'lunch' },
        { name: '万松园夜宵', area: '江汉路', cost: 100, duration: 120, desc: '小龙虾配藕汤，武汉夏夜标配。', tags: ['夜宵', '小龙虾'], slot: 'evening' }
      ],
      sight: [
        { name: '黄鹤楼', area: '黄鹤楼', cost: 70, duration: 150, desc: '登楼望长江，诗词里的地标。', tags: ['名楼', '门票'], slot: 'any' },
        { name: '湖北省博物馆', area: '东湖', cost: 0, duration: 180, desc: '越王勾践剑与曾侯乙编钟，需预约。', tags: ['博物馆', '免费'], slot: 'any' },
        { name: '东湖绿道', area: '东湖', cost: 0, duration: 180, desc: '环湖骑行，中国最大的城中湖。', tags: ['湖景', '骑行'], slot: 'any' },
        { name: '武汉长江大桥', area: '黄鹤楼', cost: 0, duration: 90, desc: '一桥飞架南北，桥头看江景。', tags: ['大桥', '免费'], slot: 'any' },
        { name: '古德寺', area: '昙华林', cost: 0, duration: 90, desc: '欧式风格的佛教寺院，很出片。', tags: ['寺庙', '建筑'], slot: 'any' }
      ],
      photo: [
        { name: '长江大桥日落', area: '黄鹤楼', cost: 0, duration: 90, desc: '桥上车流与江面金光，经典机位。', tags: ['日落', '免费'], slot: 'evening' },
        { name: '东湖樱花', area: '东湖', cost: 0, duration: 90, desc: '三月樱花盛开，湖畔一片粉白。', tags: ['樱花', '免费'], slot: 'morning' },
        { name: '昙华林文艺街', area: '昙华林', cost: 0, duration: 120, desc: '老街区与咖啡馆，慢节奏街拍。', tags: ['文艺', '免费'], slot: 'afternoon' },
        { name: '江汉关夜景', area: '江汉路', cost: 0, duration: 90, desc: '老海关钟楼配灯光，复古氛围。', tags: ['夜景', '免费'], slot: 'evening' }
      ]
    },
    {
      name: '桂林',
      region: '广西',
      tagline: '山水甲天下',
      image: 'https://images.unsplash.com/photo-1505846951821-e25bac6499b4?auto=format&fit=crop&w=900&q=80',
      areas: [{ name: '象鼻山', lat: 25.2680, lng: 110.2910 }, { name: '两江四湖', lat: 25.2740, lng: 110.2950 }, { name: '阳朔', lat: 24.7780, lng: 110.4960 }, { name: '兴坪', lat: 24.9070, lng: 110.5300 }, { name: '龙脊梯田', lat: 25.7400, lng: 110.1200 }],
      food: [
        { name: '桂林米粉', area: '象鼻山', cost: 12, duration: 30, desc: '干拌卤粉加锅烧，酸笋随意加。', tags: ['早餐', '米粉'], slot: 'morning' },
        { name: '啤酒鱼', area: '阳朔', cost: 140, duration: 100, desc: '漓江鱼配啤酒焖煮，阳朔招牌。', tags: ['阳朔', '特色'], slot: 'lunch' },
        { name: '桂花糕', area: '两江四湖', cost: 15, duration: 30, desc: '桂花香气的小点心，配茶正好。', tags: ['糕点', '甜品'], slot: 'afternoon' },
        { name: '阳朔夜市', area: '阳朔', cost: 70, duration: 100, desc: '田螺、烤鱼、艾叶粑，西街夜晚热闹。', tags: ['夜市', '小吃'], slot: 'evening' },
        { name: '漓江船餐', area: '兴坪', cost: 80, duration: 90, desc: '船上吃农家菜，边吃边看山水。', tags: ['江景', '农家菜'], slot: 'lunch' }
      ],
      sight: [
        { name: '象鼻山', area: '象鼻山', cost: 55, duration: 120, desc: '桂林城徽，象鼻饮水入漓江。', tags: ['地标', '门票'], slot: 'any' },
        { name: '漓江竹筏', area: '兴坪', cost: 120, duration: 180, desc: '乘竹筏看九马画山，人在画中游。', tags: ['漓江', '体验'], slot: 'any' },
        { name: '遇龙河', area: '阳朔', cost: 160, duration: 150, desc: '田园风光中的竹筏漂流，安静舒缓。', tags: ['漂流', '田园'], slot: 'any' },
        { name: '十里画廊', area: '阳朔', cost: 0, duration: 150, desc: '骑行看月亮山与田园，一路好风光。', tags: ['骑行', '免费'], slot: 'any' },
        { name: '龙脊梯田', area: '龙脊梯田', cost: 80, duration: 300, desc: '层层梯田如诗如画，适合住一晚看晨雾。', tags: ['梯田', '世界遗产'], slot: 'any' }
      ],
      photo: [
        { name: '阳朔日落', area: '阳朔', cost: 0, duration: 90, desc: '骆驼过江的日落，田园镀上金色。', tags: ['日落', '免费'], slot: 'evening' },
        { name: '兴坪渔火', area: '兴坪', cost: 0, duration: 90, desc: '老渔翁与鸬鹚，20 元人民币取景地。', tags: ['渔火', '免费'], slot: 'evening' },
        { name: '龙脊日出', area: '龙脊梯田', cost: 0, duration: 90, desc: '晨雾中的梯田日出，层层发光。', tags: ['日出', '免费'], slot: 'morning' },
        { name: '象鼻山晨雾', area: '象鼻山', cost: 0, duration: 60, desc: '清晨江面薄雾，山水更有层次。', tags: ['晨雾', '免费'], slot: 'morning' }
      ]
    },
    {
      name: '丽江',
      region: '云南',
      tagline: '雪山与古城',
      image: 'https://images.unsplash.com/photo-1505846951821-e25bac6499b4?auto=format&fit=crop&w=900&q=80',
      areas: [{ name: '丽江古城', lat: 26.8721, lng: 100.2299 }, { name: '束河古镇', lat: 26.8910, lng: 100.2190 }, { name: '玉龙雪山', lat: 27.0981, lng: 100.1750 }, { name: '蓝月谷', lat: 27.0700, lng: 100.2000 }, { name: '拉市海', lat: 26.8000, lng: 100.1200 }],
      food: [
        { name: '丽江粑粑', area: '丽江古城', cost: 15, duration: 45, desc: '外皮酥脆的烤粑粑，甜咸都行。', tags: ['早餐', '小吃'], slot: 'morning' },
        { name: '腊排骨火锅', area: '丽江古城', cost: 110, duration: 120, desc: '风干腊排骨炖汤，越煮越香。', tags: ['火锅', '纳西'], slot: 'dinner' },
        { name: '鸡豆凉粉', area: '丽江古城', cost: 12, duration: 30, desc: '鸡豆做的凉粉，酸辣开胃。', tags: ['小吃', '酸辣'], slot: 'afternoon' },
        { name: '纳西烤鱼', area: '束河古镇', cost: 90, duration: 100, desc: '炭火烤鱼配洋芋，古镇夜宵。', tags: ['烤鱼', '夜宵'], slot: 'evening' },
        { name: '束河咖啡馆', area: '束河古镇', cost: 50, duration: 90, desc: '河边咖啡馆晒太阳，慢生活标配。', tags: ['咖啡', '休闲'], slot: 'afternoon' }
      ],
      sight: [
        { name: '大研古城', area: '丽江古城', cost: 0, duration: 180, desc: '四方街、木府与流水，纳西文化的中心。', tags: ['古城', '免费'], slot: 'any' },
        { name: '玉龙雪山', area: '玉龙雪山', cost: 100, duration: 240, desc: '乘大索道登冰川公园，记得带氧气。', tags: ['雪山', '门票'], slot: 'any' },
        { name: '蓝月谷', area: '蓝月谷', cost: 0, duration: 120, desc: '雪山下的蓝色湖水，像仙境。', tags: ['湖景', '免费'], slot: 'any' },
        { name: '束河古镇', area: '束河古镇', cost: 0, duration: 150, desc: '比大研更安静，青龙桥看雪山。', tags: ['古镇', '免费'], slot: 'any' },
        { name: '黑龙潭', area: '丽江古城', cost: 50, duration: 90, desc: '潭水倒映玉龙雪山，经典机位。', tags: ['公园', '门票'], slot: 'any' }
      ],
      photo: [
        { name: '雪山日照金山', area: '玉龙雪山', cost: 0, duration: 60, desc: '清晨第一缕光点亮雪山尖，震撼。', tags: ['雪山', '免费'], slot: 'morning' },
        { name: '古城夜景', area: '丽江古城', cost: 0, duration: 90, desc: '灯火与木楼，夜游古城更出片。', tags: ['夜景', '免费'], slot: 'evening' },
        { name: '蓝月谷', area: '蓝月谷', cost: 0, duration: 90, desc: '碧蓝湖水配雪山，怎么拍都好看。', tags: ['湖景', '免费'], slot: 'morning' },
        { name: '拉市海', area: '拉市海', cost: 0, duration: 90, desc: '候鸟与芦苇，高原湿地日落温柔。', tags: ['湿地', '免费'], slot: 'evening' }
      ]
    },
    {
      name: '三亚',
      region: '海南',
      tagline: '热带海岛',
      image: 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?auto=format&fit=crop&w=900&q=80',
      areas: [{ name: '大东海', lat: 18.2140, lng: 109.5160 }, { name: '亚龙湾', lat: 18.2100, lng: 109.6390 }, { name: '天涯海角', lat: 18.2920, lng: 109.3290 }, { name: '蜈支洲岛', lat: 18.3050, lng: 109.7590 }, { name: '海棠湾', lat: 18.3810, lng: 109.7610 }],
      food: [
        { name: '第一市场海鲜', area: '大东海', cost: 180, duration: 120, desc: '现买现加工，皮皮虾和芒果螺是热门。', tags: ['海鲜', '市场'], slot: 'dinner' },
        { name: '椰子鸡', area: '大东海', cost: 120, duration: 100, desc: '椰青水做汤底，鸡肉鲜甜。', tags: ['海南菜', '清甜'], slot: 'lunch' },
        { name: '清补凉', area: '大东海', cost: 15, duration: 30, desc: '椰奶配西瓜、椰肉、龟苓膏，解暑神器。', tags: ['甜品', '解暑'], slot: 'afternoon' },
        { name: '东山羊', area: '亚龙湾', cost: 130, duration: 100, desc: '白切东山羊配蒜蓉酱，本地风味。', tags: ['海南菜', '羊肉'], slot: 'lunch' },
        { name: '海棠湾夜宵', area: '海棠湾', cost: 90, duration: 100, desc: '海边烧烤配椰汁，吹着海风吃。', tags: ['夜宵', '海边'], slot: 'evening' }
      ],
      sight: [
        { name: '亚龙湾', area: '亚龙湾', cost: 0, duration: 180, desc: '沙白水清，三亚最经典的海湾。', tags: ['海滩', '免费'], slot: 'any' },
        { name: '天涯海角', area: '天涯海角', cost: 68, duration: 150, desc: '天涯石与海角石，浪漫打卡地。', tags: ['地标', '门票'], slot: 'any' },
        { name: '南山文化旅游区', area: '天涯海角', cost: 108, duration: 240, desc: '海上观音像庄严壮观，园林清幽。', tags: ['观音', '门票'], slot: 'any' },
        { name: '蜈支洲岛', area: '蜈支洲岛', cost: 144, duration: 300, desc: '潜水与水上项目，海水通透。', tags: ['海岛', '门票'], slot: 'any' },
        { name: '热带天堂森林公园', area: '亚龙湾', cost: 158, duration: 180, desc: '登顶俯瞰亚龙湾，《非诚勿扰》取景地。', tags: ['森林', '门票'], slot: 'any' }
      ],
      photo: [
        { name: '亚龙湾日出', area: '亚龙湾', cost: 0, duration: 60, desc: '清晨海面被染成金色，安静美好。', tags: ['日出', '免费'], slot: 'morning' },
        { name: '海棠湾日落', area: '海棠湾', cost: 0, duration: 90, desc: '开阔海面看日落，晚霞浓烈。', tags: ['日落', '免费'], slot: 'evening' },
        { name: '蜈支洲岛海水', area: '蜈支洲岛', cost: 0, duration: 60, desc: '果冻海一样的透明度，水下更美。', tags: ['海岛', '免费'], slot: 'morning' },
        { name: '南山海上观音', area: '天涯海角', cost: 0, duration: 90, desc: '海天之间的观音像，角度很震撼。', tags: ['观音', '免费'], slot: 'afternoon' }
      ]
    },
    {
      name: '哈尔滨',
      region: '黑龙江',
      tagline: '冰雪之城',
      image: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?auto=format&fit=crop&w=900&q=80',
      areas: [{ name: '中央大街', lat: 45.7710, lng: 126.6190 }, { name: '圣索菲亚', lat: 45.7680, lng: 126.6200 }, { name: '老道外', lat: 45.7750, lng: 126.6400 }, { name: '太阳岛', lat: 45.7840, lng: 126.5850 }, { name: '冰雪大世界', lat: 45.8100, lng: 126.5750 }],
      food: [
        { name: '马迭尔冰棍', area: '中央大街', cost: 10, duration: 15, desc: '零下二三十度吃冰棍，哈尔滨式浪漫。', tags: ['甜品', '必吃'], slot: 'afternoon' },
        { name: '锅包肉', area: '中央大街', cost: 60, duration: 60, desc: '外酥里嫩酸甜口，东北名菜。', tags: ['东北菜', '经典'], slot: 'lunch' },
        { name: '东北烧烤', area: '老道外', cost: 90, duration: 100, desc: '大串烤肉配哈啤，夜晚标配。', tags: ['烧烤', '夜宵'], slot: 'evening' },
        { name: '老道外砂锅', area: '老道外', cost: 35, duration: 60, desc: '热腾腾的砂锅豆腐，暖身暖胃。', tags: ['砂锅', '暖身'], slot: 'lunch' },
        { name: '中央大街红肠', area: '中央大街', cost: 30, duration: 30, desc: '蒜香红肠配大列巴，边走边啃。', tags: ['小吃', '本地'], slot: 'afternoon' }
      ],
      sight: [
        { name: '圣索菲亚教堂', area: '圣索菲亚', cost: 20, duration: 90, desc: '拜占庭式洋葱顶，哈尔滨地标。', tags: ['教堂', '门票'], slot: 'any' },
        { name: '中央大街', area: '中央大街', cost: 0, duration: 150, desc: '百年面包石步行街，欧式建筑林立。', tags: ['老街', '免费'], slot: 'any' },
        { name: '冰雪大世界', area: '冰雪大世界', cost: 330, duration: 240, desc: '冰雕雪塑与滑梯，冬季限定奇观。', tags: ['冰雪', '门票'], slot: 'evening' },
        { name: '太阳岛', area: '太阳岛', cost: 30, duration: 180, desc: '松花江北岸的园林，夏天避暑冬天赏雪。', tags: ['公园', '门票'], slot: 'any' },
        { name: '老道外中华巴洛克', area: '老道外', cost: 0, duration: 120, desc: '中西合璧的建筑街区，烟火气很足。', tags: ['建筑', '免费'], slot: 'any' }
      ],
      photo: [
        { name: '冰雪大世界夜景', area: '冰雪大世界', cost: 0, duration: 90, desc: '彩灯下的冰建筑，梦幻感拉满。', tags: ['夜景', '冰雪'], slot: 'evening' },
        { name: '中央大街街拍', area: '中央大街', cost: 0, duration: 90, desc: '欧式建筑配冬日暖阳，很有氛围。', tags: ['街拍', '免费'], slot: 'afternoon' },
        { name: '圣索菲亚教堂', area: '圣索菲亚', cost: 0, duration: 60, desc: '鸽群与洋葱顶，清晨人少最好拍。', tags: ['教堂', '免费'], slot: 'morning' },
        { name: '松花江日落', area: '太阳岛', cost: 0, duration: 90, desc: '冰面或江面反射落日，色调很冷冽。', tags: ['日落', '免费'], slot: 'evening' }
      ]
    },
    {
      name: '洛阳',
      region: '河南',
      tagline: '千年帝都',
      image: 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=900&q=80',
      areas: [{ name: '龙门石窟', lat: 34.5550, lng: 112.4700 }, { name: '白马寺', lat: 34.7220, lng: 112.5980 }, { name: '丽景门', lat: 34.6770, lng: 112.4560 }, { name: '洛阳博物馆', lat: 34.6550, lng: 112.4200 }, { name: '老君山', lat: 33.8400, lng: 111.5600 }],
      food: [
        { name: '洛阳水席', area: '丽景门', cost: 120, duration: 120, desc: '汤汤水水的宴席菜，牡丹燕菜是招牌。', tags: ['水席', '经典'], slot: 'lunch' },
        { name: '羊肉汤', area: '丽景门', cost: 25, duration: 45, desc: '清晨一碗汤，肉烂汤浓配饼。', tags: ['早餐', '羊肉'], slot: 'morning' },
        { name: '浆面条', area: '老君山', cost: 15, duration: 45, desc: '酸浆发酵的面条，本地人才懂。', tags: ['小吃', '酸香'], slot: 'lunch' },
        { name: '牡丹燕菜', area: '丽景门', cost: 45, duration: 60, desc: '萝卜丝雕成牡丹状，水席名菜。', tags: ['水席', '特色'], slot: 'lunch' },
        { name: '老城十字街夜宵', area: '丽景门', cost: 70, duration: 100, desc: '不翻汤、烤串、糖葫芦，夜晚热闹。', tags: ['夜宵', '老街'], slot: 'evening' }
      ],
      sight: [
        { name: '龙门石窟', area: '龙门石窟', cost: 90, duration: 240, desc: '卢舍那大佛与十万造像，震撼人心。', tags: ['世界遗产', '门票'], slot: 'any' },
        { name: '白马寺', area: '白马寺', cost: 35, duration: 150, desc: '中国第一古刹，印度泰式佛殿并存。', tags: ['寺庙', '历史'], slot: 'any' },
        { name: '洛阳博物馆', area: '洛阳博物馆', cost: 0, duration: 150, desc: '河洛文明与唐三彩，免费预约。', tags: ['博物馆', '免费'], slot: 'any' },
        { name: '关林庙', area: '丽景门', cost: 40, duration: 120, desc: '关公首级葬地，古柏森森。', tags: ['历史', '门票'], slot: 'any' },
        { name: '老君山', area: '老君山', cost: 100, duration: 300, desc: '金顶道观与云海，仙境气质。', tags: ['山景', '道教'], slot: 'any' }
      ],
      photo: [
        { name: '龙门石窟夜景', area: '龙门石窟', cost: 0, duration: 90, desc: '夜晚灯光点亮石窟，震撼出片。', tags: ['夜景', '免费'], slot: 'evening' },
        { name: '牡丹花海', area: '洛阳博物馆', cost: 0, duration: 90, desc: '四月牡丹盛开，国色天香。', tags: ['牡丹', '免费'], slot: 'morning' },
        { name: '老君山金顶', area: '老君山', cost: 0, duration: 120, desc: '云海之上的金殿，宛如仙境。', tags: ['云海', '免费'], slot: 'morning' },
        { name: '丽景门灯笼', area: '丽景门', cost: 0, duration: 90, desc: '老城门红灯笼，夜色古韵十足。', tags: ['夜景', '免费'], slot: 'evening' }
      ]
    }
  ];

  // 住宿推荐：area 与区域坐标对应，住宿位置会联动每日动线
  window.LUSHU_LODGING = {
    '成都': [
      { name: '宽窄巷子旁·川西小院', area: '宽窄巷子', type: '民宿', price: 380, desc: '闹中取静的四合院改造，步行就能逛宽窄巷子。', tags: ['设计感', '步行友好'] },
      { name: '春熙路商圈酒店', area: '玉林路', type: '酒店', price: 520, desc: '地铁口商圈酒店，去玉林路和九眼桥都方便。', tags: ['交通便利', '商圈'] },
      { name: '东郊记忆艺术酒店', area: '东郊记忆', type: '酒店', price: 460, desc: '老厂房改造的工业风酒店，看完展览直接入住。', tags: ['工业风', '安静'] }
    ],
    '杭州': [
      { name: '西湖东线·湖景民宿', area: '西湖东线', type: '民宿', price: 520, desc: '离断桥步行 5 分钟，早起绕湖散步很舒服。', tags: ['湖景', '步行友好'] },
      { name: '龙井茶园民宿', area: '龙井', type: '民宿', price: 460, desc: '住在茶园里，早上推开窗就是茶山。', tags: ['茶园', '安静'] },
      { name: '运河边精品酒店', area: '运河', type: '酒店', price: 420, desc: '桥西直街旁的精品酒店，夜游运河方便。', tags: ['运河景', '精品'] }
    ],
    '重庆': [
      { name: '渝中半岛江景酒店', area: '渝中半岛', type: '酒店', price: 500, desc: '落地窗看两江交汇，洪崖洞就在步行范围。', tags: ['江景', '夜景'] },
      { name: '南滨路江景民宿', area: '南滨路', type: '民宿', price: 420, desc: '隔江看渝中夜景，楼下就是南滨路步道。', tags: ['江景', '夜景'] },
      { name: '磁器口古镇客栈', area: '磁器口', type: '客栈', price: 320, desc: '古镇里的老宅客栈，适合深度慢游。', tags: ['古镇', '特色'] }
    ],
    '西安': [
      { name: '南门城墙边酒店', area: '城墙·南门', type: '酒店', price: 450, desc: '紧邻城墙和永宁门，骑自行车上城墙方便。', tags: ['城墙景', '交通便利'] },
      { name: '大雁塔旁精品酒店', area: '大雁塔', type: '酒店', price: 480, desc: '走路去大唐不夜城，晚上逛完直接回。', tags: ['步行友好', '夜景'] },
      { name: '回民街老字号客栈', area: '回民街', type: '客栈', price: 300, desc: '藏在回民街巷子里的老院子，吃住都方便。', tags: ['老街', '特色'] }
    ],
    '厦门': [
      { name: '鼓浪屿老别墅民宿', area: '鼓浪屿', type: '民宿', price: 480, desc: '百年红砖别墅，住一晚感受小岛清晨。', tags: ['海岛', '复古'] },
      { name: '沙坡尾艺术民宿', area: '沙坡尾', type: '民宿', price: 420, desc: '老渔港改造的文艺民宿，楼下就是咖啡店。', tags: ['文创', '步行友好'] },
      { name: '环岛路海景酒店', area: '环岛路', type: '酒店', price: 560, desc: '面朝大海的房间，傍晚下楼就是沙滩。', tags: ['海景', '度假'] }
    ],
    '大理': [
      { name: '洱海西岸海景民宿', area: '洱海西岸', type: '民宿', price: 540, desc: '面朝洱海的院子，看日出不用出门。', tags: ['海景', '日出'] },
      { name: '大理古城白族院', area: '大理古城', type: '民宿', price: 380, desc: '白族三坊一照壁院落，古城里生活方便。', tags: ['古城', '白族'] },
      { name: '双廊临湖客栈', area: '双廊', type: '客栈', price: 460, desc: '临水而居，推窗见湖，适合发呆。', tags: ['湖景', '浪漫'] }
    ],
    '青岛': [
      { name: '栈桥海景酒店', area: '老城·栈桥', type: '酒店', price: 480, desc: '老城区的海景酒店，出门就是栈桥和海滩。', tags: ['海景', '地标'] },
      { name: '八大关洋房民宿', area: '八大关', type: '民宿', price: 520, desc: '百年德式洋房，住进红瓦绿树里。', tags: ['复古', '安静'] },
      { name: '奥帆中心海景公寓', area: '奥帆中心', type: '公寓', price: 440, desc: '帆船码头旁的海景公寓，晚上散步看海。', tags: ['海景', '夜景'] }
    ],
    '上海': [
      { name: '外滩老饭店', area: '外滩', type: '酒店', price: 620, desc: '百年历史酒店，窗外就是外滩万国建筑。', tags: ['历史', '江景'] },
      { name: '武康路梧桐民宿', area: '武康路', type: '民宿', price: 540, desc: '梧桐区老洋房，楼下就是咖啡店和街拍点。', tags: ['梧桐', '文艺'] },
      { name: '豫园城隍庙客栈', area: '豫园', type: '客栈', price: 420, desc: '老城厢里的客栈，逛豫园和城隍庙超方便。', tags: ['老城厢', '步行友好'] }
    ],
    '北京': [
      { name: '前门四合院酒店', area: '前门·大栅栏', type: '酒店', price: 560, desc: '四合院式酒店，去天安门看升旗步行可达。', tags: ['四合院', '地标'] },
      { name: '什刹海胡同民宿', area: '什刹海', type: '民宿', price: 500, desc: '胡同里的四合院民宿，逛后海看夜景方便。', tags: ['胡同', '特色'] },
      { name: '798 艺术酒店', area: '798 艺术区', type: '酒店', price: 460, desc: '工业风艺术酒店，看完展步行回房间。', tags: ['艺术', '工业风'] }
    ],
    '广州': [
      { name: '沙面欧陆酒店', area: '沙面', type: '酒店', price: 520, desc: '百年欧陆建筑里的酒店，清晨逛沙面人少。', tags: ['欧陆', '历史'] },
      { name: '北京路步行街酒店', area: '北京路', type: '酒店', price: 440, desc: '楼下就是北京路和惠福路美食街。', tags: ['美食', '步行友好'] },
      { name: '珠江新城江景酒店', area: '珠江新城', type: '酒店', price: 640, desc: '高层看珠江和小蛮腰，夜景绝佳。', tags: ['江景', '夜景'] }
    ],
    '深圳': [
      { name: '福田中心商务酒店', area: '福田中心', type: '酒店', price: 520, desc: '地铁上盖，去深圳湾公园和莲花山都方便。', tags: ['交通便利', '商圈'] },
      { name: '华侨城创意民宿', area: '华侨城', type: '民宿', price: 440, desc: '创意园旁边的民宿，适合慢慢逛园区。', tags: ['文创', '安静'] },
      { name: '大梅沙海景酒店', area: '盐田海滨', type: '酒店', price: 580, desc: '离沙滩几步路，第二天一早看海。', tags: ['海景', '度假'] }
    ],
    '苏州': [
      { name: '平江路水巷民宿', area: '平江路', type: '民宿', price: 500, desc: '小桥流水旁的民宿，推窗就是水巷。', tags: ['水乡', '步行友好'] },
      { name: '拙政园旁园林酒店', area: '拙政园', type: '酒店', price: 540, desc: '紧邻拙政园和苏博，清晨人少时入园。', tags: ['园林', '地标'] },
      { name: '金鸡湖湖景酒店', area: '金鸡湖', type: '酒店', price: 620, desc: '湖景房看摩天轮夜景，现代苏州一面。', tags: ['湖景', '夜景'] }
    ],
    '南京': [
      { name: '老门东庭院民宿', area: '老门东', type: '民宿', price: 460, desc: '徽派庭院民宿，晚上逛老门东灯笼街。', tags: ['庭院', '老街'] },
      { name: '玄武湖畔酒店', area: '玄武湖', type: '酒店', price: 520, desc: '湖景房看明城墙和湖面日落。', tags: ['湖景', '日落'] },
      { name: '颐和路民国公馆', area: '颐和路', type: '民宿', price: 580, desc: '民国老洋房改造，梧桐大道上散步。', tags: ['民国', '梧桐'] }
    ],
    '长沙': [
      { name: '五一广场高空酒店', area: '五一广场', type: '酒店', price: 480, desc: '市中心高层，逛吃和夜宵都在步行圈。', tags: ['商圈', '夜景'] },
      { name: '太平街里老宅民宿', area: '太平街', type: '民宿', price: 380, desc: '老街里的老宅，夜晚街巷更有味道。', tags: ['老街', '特色'] },
      { name: '岳麓山脚设计酒店', area: '岳麓山', type: '酒店', price: 520, desc: '靠近岳麓书院，早起上山空气好。', tags: ['山景', '安静'] }
    ],
    '武汉': [
      { name: '江汉路老洋房酒店', area: '江汉路', type: '酒店', price: 480, desc: '老汉口洋房建筑，楼下就是江汉关。', tags: ['历史', '夜景'] },
      { name: '东湖绿道民宿', area: '东湖', type: '民宿', price: 440, desc: '靠近东湖绿道，早起骑行很方便。', tags: ['湖景', '骑行'] },
      { name: '昙华林文艺客栈', area: '昙华林', type: '客栈', price: 360, desc: '老街区里的文艺客栈，适合慢逛。', tags: ['文艺', '老街'] }
    ],
    '桂林': [
      { name: '两江四湖江景酒店', area: '两江四湖', type: '酒店', price: 460, desc: '步行看两江四湖夜景，去象鼻山也近。', tags: ['江景', '夜景'] },
      { name: '阳朔西街客栈', area: '阳朔', type: '客栈', price: 380, desc: '西街旁的客栈，晚上逛夜市方便。', tags: ['阳朔', '夜生活'] },
      { name: '兴坪漓江民宿', area: '兴坪', type: '民宿', price: 420, desc: '漓江边的小院，看 20 元人民币背景。', tags: ['漓江', '山水'] }
    ],
    '丽江': [
      { name: '丽江古城纳西院', area: '丽江古城', type: '民宿', price: 420, desc: '纳西风格院落，晚上逛古城安静惬意。', tags: ['古城', '纳西'] },
      { name: '束河古镇客栈', area: '束河古镇', type: '客栈', price: 380, desc: '河边客栈，比大研更安静，适合发呆。', tags: ['古镇', '安静'] },
      { name: '雪山观景民宿', area: '玉龙雪山', type: '民宿', price: 560, desc: '院子里就能看日照金山，适合拍雪山。', tags: ['雪山', '日出'] }
    ],
    '三亚': [
      { name: '大东海海景酒店', area: '大东海', type: '酒店', price: 560, desc: '市区海景酒店，去第一市场吃海鲜方便。', tags: ['海景', '便利'] },
      { name: '亚龙湾度假酒店', area: '亚龙湾', type: '酒店', price: 780, desc: '私家沙滩和泳池，适合放松度假。', tags: ['沙滩', '度假'] },
      { name: '海棠湾亲子酒店', area: '海棠湾', type: '酒店', price: 720, desc: '亲子设施齐全，逛免税店也近。', tags: ['亲子', '免税'] }
    ],
    '哈尔滨': [
      { name: '中央大街欧式酒店', area: '中央大街', type: '酒店', price: 480, desc: '百年欧式建筑酒店，下楼就是中央大街。', tags: ['欧式', '地标'] },
      { name: '圣索菲亚旁酒店', area: '圣索菲亚', type: '酒店', price: 440, desc: '步行看教堂夜景，早上人少好拍照。', tags: ['教堂', '步行友好'] },
      { name: '老道外巴洛克客栈', area: '老道外', type: '客栈', price: 360, desc: '中华巴洛克建筑里的客栈，烟火气十足。', tags: ['巴洛克', '老街'] }
    ],
    '洛阳': [
      { name: '丽景门古城客栈', area: '丽景门', type: '客栈', price: 360, desc: '老城里的客栈，晚上逛十字街夜市方便。', tags: ['古城', '夜市'] },
      { name: '龙门石窟旁酒店', area: '龙门石窟', type: '酒店', price: 420, desc: '离龙门石窟近，早进园避开人流。', tags: ['石窟', '早起'] },
      { name: '洛阳博物馆商圈酒店', area: '洛阳博物馆', type: '酒店', price: 440, desc: '博物馆旁商圈酒店，交通方便。', tags: ['商圈', '交通便利'] }
    ]
  };
})();
