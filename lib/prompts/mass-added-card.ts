import { THEME_LABELS, type MassPersonality, type MassTheme } from "./mass";

export type AddedCard = { name: string; nameZh: string; isReversed: boolean };
export type Addition = { target: number; purpose: string; cards: AddedCard[] };
export type AddedReading = { readingCards: AddedCard[]; additions: Addition[] };
export const ADDED_POSITIONS = ["头脑", "忠告", "结果", "关系人"];

// 钟适惠《塔罗教室，就在你家》书内 pp.39–40、101–121（PDF pp.42–43、104–124）。
// 原创概述；原牌、加牌归属及顺序分别保留。教材未注明正逆位。
export const ADDED_CARD_CASES = [
  { title: "觉得自己不够好", pages: "101–103", base: "争吵（权杖五）／金币皇后／英勇（权杖七）", chain: "结果英勇 → 圣杯骑士", purpose: "勇气具体要用于什么？", lesson: "勇气被补充为表达和坦露自己的感受。金币皇后的接纳仍是基础，加牌没有取代勇气。" },
  { title: "市调工作不顺", pages: "103–105", base: "艺术／贤者／倒吊人", chain: "针对忠告贤者与结果倒吊人的疑问，同时加出残酷（宝剑九）、挫败（宝剑五）", purpose: "为什么有目的地沟通和行动，仍要经历困难？", lesson: "补充牌揭示该案中的自我怀疑与失败感，帮助理解行动时遇到的阻力。倒吊人已经指出观察旧模式的方向，信息完整后停止加牌；不是为了逃避困难不断抽。" },
  { title: "买房子", pages: "105–106", base: "主权（权杖二）／宝剑公主／教皇", chain: "结果教皇 → 宝剑一 → 改变（金币二） → 奢华（圣杯四）", purpose: "需了解什么 → 下什么决定 → 改变什么？", lesson: "逐层澄清为决定改变追求舒适的用钱习惯。各次加牌都有承接的问题，不能将其变成买房时间保证。" },
  { title: "照顾有过动问题的孩子", pages: "107–108", base: "挫败（宝剑五）／金币皇后／英勇（权杖七）", chain: "结果英勇 → 徒劳无益（宝剑七）", purpose: "需要勇敢去做什么？", lesson: "先安顿照顾者的挫败，再允许尝试不一定立即奏效，寻找适合的方法和支持。补充不是判定孩子没有希望，更不能据牌诊断或替代专业支持。" },
  { title: "能否成为男女朋友", pages: "109–111", base: "倒吊人／英勇（权杖七）／控制的力量（金币四）", chain: "结果控制的力量 → 残酷（宝剑九）", purpose: "需要限制的是什么？", lesson: "限制对象被具体化为自我否定的思考，而非压制关系本身。回看倒吊人的受苦和英勇的行动，形成一致理解，不保证关系成败。" },
  { title: "租赁中反复遇到麻烦", pages: "111–112", base: "宝剑骑士／宇宙／圣杯骑士", chain: "头脑宝剑骑士 → 怠惰（圣杯八）", purpose: "思绪集中在什么上？", lesson: "加牌指出该案对搬家的疲惫，连接原牌中清楚表达需要的方向。示范加牌也能补充头脑位，不能把所有租赁问题归咎于当事人。" },
  { title: "学校里的人际冲突", pages: "113–115", base: "宝剑一／金币王子／改变（金币二）", chain: "忠告金币王子 → 工作（金币三） → 女皇", purpose: "目标是什么 → 创造性的作为是什么？", lesson: "目标逐层明确为以同理心和慈悲看待冲突，再回到结果的改变。尊重案主不愿公开细节的边界，不臆造冲突内幕。" },
  { title: "十月份开身心灵工作室", pages: "115–117", base: "茅塞顿开（权杖八）／争吵（权杖五）／女祭司", chain: "头脑茅塞顿开 → 和平（宝剑二）；忠告争吵 → 女皇", purpose: "新观点是什么；需要面对的困难是什么？", lesson: "两个补充分属不同牌位：前者是尽力后顺其自然的看法，后者是给予支持的意愿与能力。不能串成一条加牌链；女祭司仍保留原来的结果位置。" },
  { title: "尼泊尔长假", pages: "117–119", base: "金币王子／塔（同属头脑位，一次抽出两牌）；控制的力量（金币四）；英勇（权杖七）", chain: "结果英勇 → 完成（权杖四） → 教皇 → 快乐（圣杯九） → 争吵（权杖五）", purpose: "勇敢完成什么 → 需要了解什么 → 期待什么？", lesson: "链条澄清为面对并完成期待解决的困难，书中据该案背景讨论旅行可能是逃避。头脑位两牌是教材特例，不是新增牌位。不能照搬取消旅行的结论给当前用户。" },
  { title: "论文研究访谈", pages: "119–121", base: "艺术／圣杯王子／获得（金币九）", chain: "忠告圣杯王子 → 担忧（金币五） → 胜利（权杖六）", purpose: "想要什么 → 在担心什么？", lesson: "补充指向过度担心如何把事做对，以致停滞。原结果强调尽到关照后接受过程，而非认为所有行为都正确；尊重受访者意愿和边界。" },
] as const;

const cardValid = (c: unknown): c is AddedCard => {
  if (!c || typeof c !== "object") return false;
  const v = c as Record<string, unknown>;
  return typeof v.name === "string" && !!v.name.trim() && typeof v.nameZh === "string" && !!v.nameZh.trim() && typeof v.isReversed === "boolean";
};
export function isAddedReading(body: unknown): body is AddedReading & Record<string, unknown> {
  if (!body || typeof body !== "object") return false;
  const b = body as AddedReading;
  if (!Array.isArray(b.readingCards) || ![3, 4].includes(b.readingCards.length) || !b.readingCards.every(cardValid) || !Array.isArray(b.additions)) return false;
  const names = new Set(b.readingCards.map(c => c.name));
  const zhNames = new Set(b.readingCards.map(c => c.nameZh));
  let count = b.readingCards.length;
  if (names.size !== count || zhNames.size !== count) return false;
  for (const a of b.additions) {
    if (!a || !Number.isInteger(a.target) || a.target < 0 || a.target >= count || typeof a.purpose !== "string" || !a.purpose.trim() || a.purpose.length > 500 || !Array.isArray(a.cards) || a.cards.length < 1 || a.cards.length > 2 || !a.cards.every(cardValid)) return false;
    for (const c of a.cards) {
      if (names.has(c.name) || zhNames.has(c.nameZh)) return false;
      names.add(c.name); zhNames.add(c.nameZh);
    }
    count += a.cards.length;
    if (count > 78) return false;
  }
  return true;
}
export function addedCardList(reading: AddedReading): AddedCard[] {
  return [...reading.readingCards, ...reading.additions.flatMap(a => a.cards)];
}
export function describeAddedReading(reading: AddedReading): string {
  const all = addedCardList(reading);
  const describe = (c: AddedCard) => `${c.nameZh}（${c.name}，${c.isReversed ? "逆位" : "正位"}）`;
  let count = reading.readingCards.length;
  return reading.readingCards.map((c, i) => `第${i + 1}张 · ${ADDED_POSITIONS[i]}：${describe(c)}`).join("\n") +
    reading.additions.map((a, i) => `\n第${i + 1}次加牌，补充第${a.target + 1}张 ${all[a.target].nameZh}，目的：${JSON.stringify(a.purpose)}\n` + a.cards.map(c => `第${++count}张 · 补充牌：${describe(c)}`).join("\n")).join("");
}
export function withAddedCardSpread(base: string, personality: MassPersonality): string {
  return `${base}

## 本次抽牌方式：加牌解读法
沿用上文所选人格的语气、称呼、禁词及字数要求，仅替换本次牌阵结构。参考钟适惠《塔罗教室，就在你家》书内39–40页和101–121页。
基础牌由输入决定：三张为头脑、忠告、结果；四张增加独立的关系人。头脑是抽牌者主观看法，忠告是需看见和采取的方向，结果是遵循忠告后的可能走向或行动。四张基础牌时，前三张属于抽牌者，第四张独立描述关系中的对方，不是未来第四阶段或读心证据。
加牌用于补充已有牌，以清楚的目的和具体未解问题为起点，不能覆盖、替换或推翻原牌以求满意答案。每次补充的目标编号及目的已在输入提供；目标可能是基础牌，也可能是此前的补充牌。依照链条与所属原牌位置连贯解读，区分不同分支；同次两张是共同说明同一问题。不能把补充牌另当新牌位或未来时间线。
没有加牌时仅解读输入的基础牌，不预先编造补充牌或强行要求加牌。有加牌时结合完整链条，重点回答最后一次明确目的，保留原牌的意义。信息完整就停止；仍困惑时坦诚保留不确定，回到已理解部分，不劝用户不断加抽。
以下10例为方法参考，绝非当前用户的经历或本次牌。不要把书中的补充牌、心理背景、结论自动套用到用户。保留透特牌名及王子、公主、骑士区别；金币对应星币，贤者对应魔术师主题（并非教皇），宇宙对应世界、艺术对应节制。教材无正逆位标记，本次按实际输入正逆位解读。
${ADDED_CARD_CASES.map((c,i) => `案例${i+1}：${c.title}（书内${c.pages}页）\n原牌：${c.base}\n加牌归属与顺序：${c.chain}\n明确目的：${c.purpose}\n方法要点：${c.lesson}`).join("\n\n")}
输出：先按基础牌位解读，再在有加牌时输出「加牌解读」，明确原牌→补充牌及其目的，最后自然串联已知信息。不要输出验证牌、星座或信息对应。${personality === "intp" ? "保持 INTP 原人格的表达方式，不增加报告式总结、祝福或鸡汤。" : "保持默认人格的生活化表达和原有收尾风格。"}`;
}
export function buildAddedCardUserPrompt(theme: MassTheme, group: number, symbol: string, question: string, reading: AddedReading): string {
  return `大众占卜，主题「${THEME_LABELS[theme]}」，第${group}组（${symbol}）。\n本期问题：${JSON.stringify(question)}\n【加牌解读法】\n${describeAddedReading(reading)}\n只依据上述实际牌、归属和目的，使用所选人格解读。`;
}
export function getAddedCardMock(reading: AddedReading): string {
  return `当前为演示模式，仅展示实际抽牌与加牌记录；正式解读使用所选人格。\n\n${describeAddedReading(reading)}`;
}
