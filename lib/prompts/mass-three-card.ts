import { BOOK_PERSONALITY_CLOSING } from "./mass-book";
import type { MassPersonality, MassTheme } from "./mass";
import { THEME_LABELS } from "./mass";

type CardInfo = { nameZh: string; name: string; isReversed: boolean };
const POSITIONS = ["头脑", "忠告", "结果"] as const;

export function isThreeCardReading(cards: unknown): cards is CardInfo[] {
  return Array.isArray(cards) && cards.length === 3 && cards.every((card) =>
    card !== null && typeof card === "object" &&
    typeof card.nameZh === "string" && card.nameZh.trim().length > 0 &&
    typeof card.name === "string" && card.name.trim().length > 0 &&
    typeof card.isReversed === "boolean"
  );
}

// Keep the selected personality verbatim; only override this spread's card layout.
export function withThreeCardSpread(basePrompt: string, personality: MassPersonality): string {
  return `${basePrompt}

## 本次抽牌方式：三张牌问题解读法
保留上述人格、称呼、语气、用词禁忌、节奏和收尾风格。本段仅替换本次的牌数、牌位与输出结构：每组只有三张解读牌，没有验证牌，不输出星座、信息对应、特定讯息，也不补抽其他牌。不使用过去／现在／未来牌阵。

严格按输入顺序解读：
1. 头脑：围绕本期问题，提问者当前有意识的想法、观点、期待、态度或顾虑。这是主观认知，不等于客观事实。
2. 忠告：回应第一张牌，指出需要看见、理解或调整的地方。可能补充头脑牌，也可能与它冲突，是走向第三张的关键。
3. 结果：理解并实践忠告后可能出现的走向，或看清处境后需要采取的行动。不是必然发生的预言。

先理解头脑，再看忠告如何回应它，最后看结果。三张牌相互影响，解读时考虑从第一张到第三张的转变，以及第二张如何连接它们。将这种联系自然融入所选人格的表达，不要求报告式总结。正逆位均须结合牌位解释。

教材案例仅作方法参考，不替换本次抽牌，不照搬观众经历：
- 写作案例：太阳（头脑）→失败／金币七（忠告）→圣杯骑士（结果）。面对首次写书，太阳在这个情境中可理解为在意外界评价；失败牌提醒看见对自我暴露和被评价的恐惧，不是预言写作失败；圣杯骑士承接忠告，走向真实表达与分享内心。串联的重点是从寻求他人认可，经由觉察恐惧，转向表达自己。
- 晋升案例：权杖骑士（头脑）→毁灭／宝剑十（忠告）→月亮（结果）。头脑牌体现强烈进取心；忠告牌与它冲突，提醒识别当前路径的限度，松开「努力就一定能立即晋升」的期待；结果牌指向容纳未知、观察现实。不能据此断言本次观众一定无法升职或应当辞职。
- 教材「失败」对应金币七／星币七，「毁灭」对应宝剑十。案例中的含义依赖问题和牌位，并非这张牌在所有情境中的唯一解释。

本次直接按以下标题输出，每节写明实际牌名及正逆位：
### 🧠 头脑
### 💡 忠告
### 🌙 结果
${personality === "book" ? BOOK_PERSONALITY_CLOSING : personality === "intp"
    ? "继续使用 INTP 原有的疲惫、观察、拆本质的表达。牌间联系融入观察中，不增加结构总结，不使用宝宝等禁词，不鸡汤、不祝福、不强行圆满；结果段可停在一个具体观察或留白。"
    : "继续使用默认人格原有的称呼、口头禅、分层解读和生活化举例。牌间自然衔接，结果段保留原有温暖的建议与祝福。"}
保持所选人格原来的字数要求，围绕本期问题回答。`;
}

export function buildThreeCardUserPrompt(
  theme: MassTheme, groupNumber: number, groupSymbol: string,
  question: string, cards: CardInfo[]
): string {
  const list = cards.map((card, i) =>
    `第${i + 1}张 · ${POSITIONS[i]}：${card.nameZh}（${card.name}）— ${card.isReversed ? "逆位" : "正位"}`
  ).join("\n");
  return `大众占卜，主题「${THEME_LABELS[theme]}」，第${groupNumber}组（${groupSymbol}）。
本期问题：${JSON.stringify(question)}
三张牌按头脑、忠告、结果排列：
${list}
请保持当前选定的人格，按三张牌问题解读法解读。`;
}

export function getThreeCardMock(cards: CardInfo[]): string {
  return `当前为演示模式，仅展示牌位；正式解读将使用你选择的人格。\n\n${cards.map((card, i) =>
    `### ${POSITIONS[i]}\n${card.nameZh}（${card.isReversed ? "逆位" : "正位"}）`
  ).join("\n\n")}`;
}
