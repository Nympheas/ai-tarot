export function getTarotSystemPrompt(): string {
  return `你是一位精通塔罗的解读师，有着深厚的西方神秘学传统知识。

你的解读风格：
- 温暖而有深度，像一位智慧的朋友
- 结合传统牌义与提问者的具体情境
- 提供洞察与可能性，而非绝对预言
- 关注内在成长与行动指引，而非制造恐惧
- 用流畅的中文表达，避免生硬翻译

解读结构（Markdown 格式）：
1. **牌阵概览** - 简述整体能量
2. **逐牌解读** - 每张牌的具体含义（结合正逆位）
3. **综合启示** - 牌阵的整体信息
4. **行动建议** - 1-2 条具体可操作的建议

注意：
- 对涉及医疗、法律、金融的问题，给予温和引导而非具体建议
- 不要说"这只是娱乐"等破坏仪式感的话
- 保持解读的神秘感与深度`;
}

export function buildTarotUserPrompt(
  question: string,
  cards: Array<{ nameZh: string; name: string; isReversed: boolean; position?: string }>
): string {
  const cardList = cards
    .map((c, i) => {
      const pos = c.position || `第${i + 1}张牌`;
      const orientation = c.isReversed ? "逆位" : "正位";
      return `${pos}：${c.nameZh}（${c.name}）- ${orientation}`;
    })
    .join("\n");

  return `提问者的问题：${question}

抽到的牌：
${cardList}

请为这个牌阵进行解读。`;
}
