export type TarotCard = {
  id: number;
  name: string;
  nameZh: string;
  arcana: "major" | "minor";
  suit?: string;
  keywords: string[];
  uprightMeaning: string;
  reversedMeaning: string;
};

export const MAJOR_ARCANA: TarotCard[] = [
  { id: 0, name: "The Fool", nameZh: "愚者", arcana: "major", keywords: ["新开始", "冒险", "纯真"], uprightMeaning: "新的旅程，无限可能，勇敢踏出第一步", reversedMeaning: "鲁莽，缺乏计划，忽视风险" },
  { id: 1, name: "The Magician", nameZh: "魔术师", arcana: "major", keywords: ["意志力", "技能", "创造"], uprightMeaning: "拥有实现目标的所有工具和能力", reversedMeaning: "操纵，技能未被善用，欺骗" },
  { id: 2, name: "The High Priestess", nameZh: "女祭司", arcana: "major", keywords: ["直觉", "神秘", "潜意识"], uprightMeaning: "倾听内心声音，神秘知识即将浮现", reversedMeaning: "压抑直觉，隐藏的议程" },
  { id: 3, name: "The Empress", nameZh: "女皇", arcana: "major", keywords: ["丰盛", "母性", "自然"], uprightMeaning: "繁荣、创造力与养育能量涌现", reversedMeaning: "依赖，创造阻塞，忽视自我" },
  { id: 4, name: "The Emperor", nameZh: "皇帝", arcana: "major", keywords: ["权威", "结构", "稳定"], uprightMeaning: "建立秩序，展现领导力，稳固基础", reversedMeaning: "独裁，控制欲，缺乏灵活性" },
  { id: 5, name: "The Hierophant", nameZh: "教皇", arcana: "major", keywords: ["传统", "信仰", "指引"], uprightMeaning: "寻求传统智慧，精神指引，遵循惯例", reversedMeaning: "打破传统，非正统，质疑权威" },
  { id: 6, name: "The Lovers", nameZh: "恋人", arcana: "major", keywords: ["爱", "选择", "结合"], uprightMeaning: "重要的选择，深刻的连接，价值观对齐", reversedMeaning: "失调，错误选择，内心矛盾" },
  { id: 7, name: "The Chariot", nameZh: "战车", arcana: "major", keywords: ["意志", "胜利", "控制"], uprightMeaning: "以坚定意志克服障碍，走向胜利", reversedMeaning: "失控，方向混乱，强迫行为" },
  { id: 8, name: "Strength", nameZh: "力量", arcana: "major", keywords: ["勇气", "耐心", "内力"], uprightMeaning: "以温柔征服力量，内在力量显现", reversedMeaning: "不安全感，怀疑自我，放弃" },
  { id: 9, name: "The Hermit", nameZh: "隐士", arcana: "major", keywords: ["内省", "孤独", "寻求"], uprightMeaning: "退隐内心，寻找内在真相与智慧", reversedMeaning: "孤立，拒绝帮助，过度内省" },
  { id: 10, name: "Wheel of Fortune", nameZh: "命运之轮", arcana: "major", keywords: ["命运", "转机", "循环"], uprightMeaning: "命运转折，好运将至，周期性变化", reversedMeaning: "坏运，抗拒变化，打破循环" },
  { id: 11, name: "Justice", nameZh: "正义", arcana: "major", keywords: ["公正", "真相", "因果"], uprightMeaning: "公平裁决，行为后果，寻求真相", reversedMeaning: "不公，逃避责任，失衡" },
  { id: 12, name: "The Hanged Man", nameZh: "倒吊人", arcana: "major", keywords: ["暂停", "牺牲", "新视角"], uprightMeaning: "主动暂停，从新角度看问题，等待时机", reversedMeaning: "拖延，牺牲无意义，不愿改变" },
  { id: 13, name: "Death", nameZh: "死神", arcana: "major", keywords: ["转化", "结束", "蜕变"], uprightMeaning: "一个阶段结束，深刻转化正在发生", reversedMeaning: "抗拒改变，停滞，害怕失去" },
  { id: 14, name: "Temperance", nameZh: "节制", arcana: "major", keywords: ["平衡", "调和", "耐心"], uprightMeaning: "寻求中道，融合对立，缓慢而稳定", reversedMeaning: "失衡，极端，缺乏节制" },
  { id: 15, name: "The Devil", nameZh: "恶魔", arcana: "major", keywords: ["束缚", "执念", "阴影"], uprightMeaning: "面对阴暗面，识别束缚自己的执念", reversedMeaning: "挣脱束缚，重获自由，觉醒" },
  { id: 16, name: "The Tower", nameZh: "塔", arcana: "major", keywords: ["突变", "动荡", "启示"], uprightMeaning: "突如其来的变化打破旧有结构", reversedMeaning: "避免灾难，缓慢崩塌，内部动荡" },
  { id: 17, name: "The Star", nameZh: "星星", arcana: "major", keywords: ["希望", "疗愈", "灵感"], uprightMeaning: "希望重燃，疗愈与更新，灵感涌现", reversedMeaning: "绝望，失去信念，与内心失联" },
  { id: 18, name: "The Moon", nameZh: "月亮", arcana: "major", keywords: ["幻觉", "恐惧", "潜意识"], uprightMeaning: "面对内心恐惧，潜意识浮现，警惕幻觉", reversedMeaning: "混乱消散，真相显露，恐惧释放" },
  { id: 19, name: "The Sun", nameZh: "太阳", arcana: "major", keywords: ["喜悦", "成功", "活力"], uprightMeaning: "充满活力与喜悦，成功与清晰到来", reversedMeaning: "短暂的阴云，过于乐观" },
  { id: 20, name: "Judgement", nameZh: "审判", arcana: "major", keywords: ["觉醒", "更新", "召唤"], uprightMeaning: "内心觉醒，回应更高的召唤，自我更新", reversedMeaning: "自我怀疑，忽视召唤，后悔" },
  { id: 21, name: "The World", nameZh: "世界", arcana: "major", keywords: ["完成", "整合", "成就"], uprightMeaning: "一个完整循环的圆满，成就与整合", reversedMeaning: "未完成，拖延完结，缺乏封闭" },
];

export const MINOR_ARCANA: TarotCard[] = [
  // 权杖 Wands
  { id: 22, name: "Ace of Wands",    nameZh: "权杖Ace",  arcana: "minor", suit: "wands",     keywords: ["新开始", "创造力", "热情"], uprightMeaning: "新的创意火花，充满热情的开始", reversedMeaning: "创意受阻，缺乏动力" },
  { id: 23, name: "Two of Wands",    nameZh: "权杖二",   arcana: "minor", suit: "wands",     keywords: ["计划", "展望", "决策"], uprightMeaning: "展望未来，制定计划，准备迈出下一步", reversedMeaning: "犹豫不决，恐惧改变" },
  { id: 24, name: "Three of Wands",  nameZh: "权杖三",   arcana: "minor", suit: "wands",     keywords: ["扩展", "远见", "机遇"], uprightMeaning: "努力开始见效，扩展视野，迎接机会", reversedMeaning: "延误，计划不如预期" },
  { id: 25, name: "Four of Wands",   nameZh: "权杖四",   arcana: "minor", suit: "wands",     keywords: ["庆祝", "稳定", "家庭"], uprightMeaning: "庆祝成就，稳定的基础，家庭和谐", reversedMeaning: "不稳定，家庭冲突" },
  { id: 26, name: "Five of Wands",   nameZh: "权杖五",   arcana: "minor", suit: "wands",     keywords: ["竞争", "冲突", "挑战"], uprightMeaning: "竞争激烈，意见不合，充满活力的挑战", reversedMeaning: "内部冲突，避免竞争" },
  { id: 27, name: "Six of Wands",    nameZh: "权杖六",   arcana: "minor", suit: "wands",     keywords: ["胜利", "认可", "成功"], uprightMeaning: "赢得认可，取得成功，被众人肯定", reversedMeaning: "失败，自我怀疑，缺乏认可" },
  { id: 28, name: "Seven of Wands",  nameZh: "权杖七",   arcana: "minor", suit: "wands",     keywords: ["防御", "坚持", "挑战"], uprightMeaning: "坚守立场，面对挑战，维护信念", reversedMeaning: "放弃，被压倒，无法维持立场" },
  { id: 29, name: "Eight of Wands",  nameZh: "权杖八",   arcana: "minor", suit: "wands",     keywords: ["速度", "行动", "进展"], uprightMeaning: "事情快速推进，行动时机到来", reversedMeaning: "延迟，混乱，行动受阻" },
  { id: 30, name: "Nine of Wands",   nameZh: "权杖九",   arcana: "minor", suit: "wands",     keywords: ["韧性", "坚持", "防御"], uprightMeaning: "坚持到底，虽疲惫但仍坚守", reversedMeaning: "精疲力竭，固执，偏执" },
  { id: 31, name: "Ten of Wands",    nameZh: "权杖十",   arcana: "minor", suit: "wands",     keywords: ["负担", "压力", "责任"], uprightMeaning: "承担过多责任，感到压力巨大", reversedMeaning: "放下负担，无法承受" },
  { id: 32, name: "Page of Wands",   nameZh: "权杖侍者", arcana: "minor", suit: "wands",     keywords: ["热情", "探索", "创意"], uprightMeaning: "充满热情地探索新领域，好奇心旺盛", reversedMeaning: "缺乏方向，热情消退" },
  { id: 33, name: "Knight of Wands", nameZh: "权杖骑士", arcana: "minor", suit: "wands",     keywords: ["冒险", "冲动", "魅力"], uprightMeaning: "充满魅力地追逐梦想，行动迅速", reversedMeaning: "鲁莽，冲动，虎头蛇尾" },
  { id: 34, name: "Queen of Wands",  nameZh: "权杖皇后", arcana: "minor", suit: "wands",     keywords: ["自信", "创造", "热情"], uprightMeaning: "充满自信与创造力，热情感染他人", reversedMeaning: "自私，善妒，缺乏自信" },
  { id: 35, name: "King of Wands",   nameZh: "权杖国王", arcana: "minor", suit: "wands",     keywords: ["领导", "远见", "魅力"], uprightMeaning: "有远见的领导者，用热情带动他人", reversedMeaning: "独断专行，冲动，期望过高" },

  // 圣杯 Cups
  { id: 36, name: "Ace of Cups",    nameZh: "圣杯Ace",  arcana: "minor", suit: "cups", keywords: ["爱", "直觉", "新情感"], uprightMeaning: "新的情感开始，爱的涌现，灵感", reversedMeaning: "情感压抑，内心空虚" },
  { id: 37, name: "Two of Cups",    nameZh: "圣杯二",   arcana: "minor", suit: "cups", keywords: ["联结", "伙伴", "吸引"], uprightMeaning: "两情相悦，深度情感连接，合作关系", reversedMeaning: "分离，关系不和，失去平衡" },
  { id: 38, name: "Three of Cups",  nameZh: "圣杯三",   arcana: "minor", suit: "cups", keywords: ["庆祝", "友谊", "喜悦"], uprightMeaning: "与好友庆祝，喜悦的聚会，社交繁荣", reversedMeaning: "过度放纵，三角关系，孤立" },
  { id: 39, name: "Four of Cups",   nameZh: "圣杯四",   arcana: "minor", suit: "cups", keywords: ["冷漠", "沉思", "机会"], uprightMeaning: "内省时期，对现状不满，错过眼前机会", reversedMeaning: "走出冷漠，重新接受，抓住机会" },
  { id: 40, name: "Five of Cups",   nameZh: "圣杯五",   arcana: "minor", suit: "cups", keywords: ["失落", "悲伤", "遗憾"], uprightMeaning: "为失去而悲伤，专注于损失，需要疗愈", reversedMeaning: "走出悲伤，接受失去，向前看" },
  { id: 41, name: "Six of Cups",    nameZh: "圣杯六",   arcana: "minor", suit: "cups", keywords: ["怀旧", "童年", "纯真"], uprightMeaning: "美好的回忆，童年的纯真，重温旧情", reversedMeaning: "活在过去，无法放手" },
  { id: 42, name: "Seven of Cups",  nameZh: "圣杯七",   arcana: "minor", suit: "cups", keywords: ["幻想", "选择", "迷幻"], uprightMeaning: "面对众多选择，沉溺幻想，需要辨别真实", reversedMeaning: "清醒认识，做出选择，放弃幻想" },
  { id: 43, name: "Eight of Cups",  nameZh: "圣杯八",   arcana: "minor", suit: "cups", keywords: ["离开", "寻找", "转变"], uprightMeaning: "离开不再满足的事物，寻找更深层的意义", reversedMeaning: "留在不健康的处境，逃避" },
  { id: 44, name: "Nine of Cups",   nameZh: "圣杯九",   arcana: "minor", suit: "cups", keywords: ["满足", "愿望", "幸福"], uprightMeaning: "心愿成真，内心满足，享受生活的丰盛", reversedMeaning: "贪心，不满足，愿望未实现" },
  { id: 45, name: "Ten of Cups",    nameZh: "圣杯十",   arcana: "minor", suit: "cups", keywords: ["圆满", "家庭", "幸福"], uprightMeaning: "家庭幸福，情感圆满，持久的喜悦", reversedMeaning: "家庭不和，关系破裂" },
  { id: 46, name: "Page of Cups",   nameZh: "圣杯侍者", arcana: "minor", suit: "cups", keywords: ["创意", "直觉", "信息"], uprightMeaning: "情感上的新开始，创意灵感，好消息", reversedMeaning: "情绪化，幼稚，创意受阻" },
  { id: 47, name: "Knight of Cups", nameZh: "圣杯骑士", arcana: "minor", suit: "cups", keywords: ["浪漫", "追求", "理想"], uprightMeaning: "浪漫的追求者，跟随内心，理想主义", reversedMeaning: "情绪不稳，不切实际，欺骗" },
  { id: 48, name: "Queen of Cups",  nameZh: "圣杯皇后", arcana: "minor", suit: "cups", keywords: ["同理心", "直觉", "养育"], uprightMeaning: "充满同理心，深刻的直觉，温柔的情感支持", reversedMeaning: "情绪失控，依赖，情感操控" },
  { id: 49, name: "King of Cups",   nameZh: "圣杯国王", arcana: "minor", suit: "cups", keywords: ["情感成熟", "智慧", "平衡"], uprightMeaning: "情感成熟，智慧地处理感情，平衡理性与感性", reversedMeaning: "情绪操控，冷漠" },

  // 宝剑 Swords
  { id: 50, name: "Ace of Swords",    nameZh: "宝剑Ace",  arcana: "minor", suit: "swords", keywords: ["清晰", "突破", "真相"], uprightMeaning: "思维清晰，突破困境，真相浮出水面", reversedMeaning: "思维混乱，沟通障碍" },
  { id: 51, name: "Two of Swords",    nameZh: "宝剑二",   arcana: "minor", suit: "swords", keywords: ["僵局", "决策", "回避"], uprightMeaning: "面临两难选择，暂时的平衡，回避做决定", reversedMeaning: "信息过载，打破僵局" },
  { id: 52, name: "Three of Swords",  nameZh: "宝剑三",   arcana: "minor", suit: "swords", keywords: ["心碎", "悲伤", "伤痛"], uprightMeaning: "心碎与悲伤，痛苦的真相，情感创伤", reversedMeaning: "走出心碎，疗愈伤痛" },
  { id: 53, name: "Four of Swords",   nameZh: "宝剑四",   arcana: "minor", suit: "swords", keywords: ["休息", "恢复", "沉思"], uprightMeaning: "需要休息与恢复，暂时退出，内省时期", reversedMeaning: "重新投入行动，过度休息" },
  { id: 54, name: "Five of Swords",   nameZh: "宝剑五",   arcana: "minor", suit: "swords", keywords: ["冲突", "失败", "损失"], uprightMeaning: "赢得争斗但失去更多，不公平的胜利", reversedMeaning: "和解，放下仇恨，从失败中学习" },
  { id: 55, name: "Six of Swords",    nameZh: "宝剑六",   arcana: "minor", suit: "swords", keywords: ["过渡", "疗愈", "前进"], uprightMeaning: "走出困境，向平静水域前进，疗愈的旅程", reversedMeaning: "无法前进，旧伤未愈" },
  { id: 56, name: "Seven of Swords",  nameZh: "宝剑七",   arcana: "minor", suit: "swords", keywords: ["欺骗", "策略", "逃避"], uprightMeaning: "需要策略性行动，欺骗或被欺骗，独自行动", reversedMeaning: "真相揭露，放弃欺骗" },
  { id: 57, name: "Eight of Swords",  nameZh: "宝剑八",   arcana: "minor", suit: "swords", keywords: ["束缚", "限制", "受害"], uprightMeaning: "感到被困，自我设限，思维上的束缚", reversedMeaning: "解脱束缚，重获自由" },
  { id: 58, name: "Nine of Swords",   nameZh: "宝剑九",   arcana: "minor", suit: "swords", keywords: ["焦虑", "噩梦", "绝望"], uprightMeaning: "深夜焦虑，过度担忧，内心的恐惧", reversedMeaning: "走出焦虑，面对恐惧" },
  { id: 59, name: "Ten of Swords",    nameZh: "宝剑十",   arcana: "minor", suit: "swords", keywords: ["终结", "背叛", "痛苦"], uprightMeaning: "一个痛苦的结局，背叛，但也意味着新的开始", reversedMeaning: "避免灾难，最坏已过" },
  { id: 60, name: "Page of Swords",   nameZh: "宝剑侍者", arcana: "minor", suit: "swords", keywords: ["好奇", "警觉", "沟通"], uprightMeaning: "充满好奇心，敏锐的观察力，新的想法", reversedMeaning: "八卦，言语伤人，思维散乱" },
  { id: 61, name: "Knight of Swords", nameZh: "宝剑骑士", arcana: "minor", suit: "swords", keywords: ["行动", "果断", "激进"], uprightMeaning: "迅速行动，直接表达，充满激情地追逐目标", reversedMeaning: "鲁莽，攻击性，缺乏计划" },
  { id: 62, name: "Queen of Swords",  nameZh: "宝剑皇后", arcana: "minor", suit: "swords", keywords: ["独立", "清晰", "直接"], uprightMeaning: "独立思考，清晰直接的判断，智慧的女性能量", reversedMeaning: "冷漠，刻薄，过于理性" },
  { id: 63, name: "King of Swords",   nameZh: "宝剑国王", arcana: "minor", suit: "swords", keywords: ["权威", "理性", "公正"], uprightMeaning: "以理性和权威做决定，公正的判断", reversedMeaning: "独裁，冷酷，用权力伤害他人" },

  // 星币 Pentacles
  { id: 64, name: "Ace of Pentacles",    nameZh: "星币Ace",  arcana: "minor", suit: "pentacles", keywords: ["机遇", "繁荣", "物质"], uprightMeaning: "新的物质机遇，财务的新开始，繁荣的种子", reversedMeaning: "错失机遇，财务不稳" },
  { id: 65, name: "Two of Pentacles",    nameZh: "星币二",   arcana: "minor", suit: "pentacles", keywords: ["平衡", "适应", "灵活"], uprightMeaning: "在多项事务间保持平衡，灵活应对变化", reversedMeaning: "失去平衡，财务混乱" },
  { id: 66, name: "Three of Pentacles",  nameZh: "星币三",   arcana: "minor", suit: "pentacles", keywords: ["团队", "技能", "合作"], uprightMeaning: "团队合作，技能得到认可，共同建造", reversedMeaning: "团队不和，缺乏合作" },
  { id: 67, name: "Four of Pentacles",   nameZh: "星币四",   arcana: "minor", suit: "pentacles", keywords: ["守财", "控制", "安全"], uprightMeaning: "保护财富，稳定的安全感，对资源的掌控", reversedMeaning: "过度守财，吝啬，财务失控" },
  { id: 68, name: "Five of Pentacles",   nameZh: "星币五",   arcana: "minor", suit: "pentacles", keywords: ["匮乏", "困难", "孤立"], uprightMeaning: "经历财务困难，感到匮乏与孤立", reversedMeaning: "走出困境，接受帮助，财务好转" },
  { id: 69, name: "Six of Pentacles",    nameZh: "星币六",   arcana: "minor", suit: "pentacles", keywords: ["给予", "接受", "慷慨"], uprightMeaning: "慷慨地给予与接受，财富共享，公平分配", reversedMeaning: "有条件的给予，债务问题" },
  { id: 70, name: "Seven of Pentacles",  nameZh: "星币七",   arcana: "minor", suit: "pentacles", keywords: ["耐心", "投资", "评估"], uprightMeaning: "耐心等待努力的回报，评估进展，长期投资", reversedMeaning: "急于求成，投资无回报" },
  { id: 71, name: "Eight of Pentacles",  nameZh: "星币八",   arcana: "minor", suit: "pentacles", keywords: ["专注", "技艺", "勤奋"], uprightMeaning: "专注于磨练技艺，勤奋工作，精益求精", reversedMeaning: "缺乏动力，工作马虎，技能停滞" },
  { id: 72, name: "Nine of Pentacles",   nameZh: "星币九",   arcana: "minor", suit: "pentacles", keywords: ["丰盛", "自足", "优雅"], uprightMeaning: "财务独立，享受自己的成果，优雅的生活", reversedMeaning: "依赖他人，财务不稳" },
  { id: 73, name: "Ten of Pentacles",    nameZh: "星币十",   arcana: "minor", suit: "pentacles", keywords: ["财富", "遗产", "家族"], uprightMeaning: "长期财务稳定，家族传承，物质上的圆满", reversedMeaning: "家族冲突，财务失败" },
  { id: 74, name: "Page of Pentacles",   nameZh: "星币侍者", arcana: "minor", suit: "pentacles", keywords: ["学习", "机遇", "实践"], uprightMeaning: "学习新技能，实际可行的机遇，脚踏实地", reversedMeaning: "缺乏实践，机遇错失" },
  { id: 75, name: "Knight of Pentacles", nameZh: "星币骑士", arcana: "minor", suit: "pentacles", keywords: ["责任", "坚持", "可靠"], uprightMeaning: "可靠勤勉，稳步推进目标，负责任的行动", reversedMeaning: "固执，停滞不前，过于保守" },
  { id: 76, name: "Queen of Pentacles",  nameZh: "星币皇后", arcana: "minor", suit: "pentacles", keywords: ["养育", "实际", "丰盛"], uprightMeaning: "实际而温暖，创造舒适的家，财务管理得当", reversedMeaning: "物质主义，忽视内心，家庭失衡" },
  { id: 77, name: "King of Pentacles",   nameZh: "星币国王", arcana: "minor", suit: "pentacles", keywords: ["财富", "稳定", "领导"], uprightMeaning: "稳健的财务领导，物质上的成功，可靠的支柱", reversedMeaning: "贪婪，物质主义，财务控制" },
];

export const ALL_CARDS: TarotCard[] = [...MAJOR_ARCANA, ...MINOR_ARCANA];

export function drawCards(count: number): TarotCard[] {
  const shuffled = [...MAJOR_ARCANA].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
