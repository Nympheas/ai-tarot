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

export function drawCards(count: number): TarotCard[] {
  const shuffled = [...MAJOR_ARCANA].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
