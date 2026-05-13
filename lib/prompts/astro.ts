export type AstroFocusArea = "overall" | "love" | "career" | "purpose" | "inner" | "recent";

export const FOCUS_LABELS: Record<AstroFocusArea, string> = {
  overall:  "整体星盘",
  love:     "爱情运势",
  career:   "事业财运",
  purpose:  "人生使命",
  inner:    "内在世界",
  recent:   "近期天象",
};

export const ZODIAC_SIGNS = [
  { sign: "白羊座", symbol: "♈", start: [3, 21], end: [4, 19] },
  { sign: "金牛座", symbol: "♉", start: [4, 20], end: [5, 20] },
  { sign: "双子座", symbol: "♊", start: [5, 21], end: [6, 20] },
  { sign: "巨蟹座", symbol: "♋", start: [6, 21], end: [7, 22] },
  { sign: "狮子座", symbol: "♌", start: [7, 23], end: [8, 22] },
  { sign: "处女座", symbol: "♍", start: [8, 23], end: [9, 22] },
  { sign: "天秤座", symbol: "♎", start: [9, 23], end: [10, 22] },
  { sign: "天蝎座", symbol: "♏", start: [10, 23], end: [11, 21] },
  { sign: "射手座", symbol: "♐", start: [11, 22], end: [12, 21] },
  { sign: "摩羯座", symbol: "♑", start: [12, 22], end: [1, 19] },
  { sign: "水瓶座", symbol: "♒", start: [1, 20], end: [2, 18] },
  { sign: "双鱼座", symbol: "♓", start: [2, 19], end: [3, 20] },
] as const;

export function getSunSign(month: number, day: number): { sign: string; symbol: string } {
  for (const z of ZODIAC_SIGNS) {
    const [sm, sd] = z.start;
    const [em, ed] = z.end;
    if (sm <= em) {
      if ((month === sm && day >= sd) || (month === em && day <= ed)) return z;
    } else {
      if ((month === sm && day >= sd) || (month === em && day <= ed) || (month > sm || month < em)) return z;
    }
  }
  return { sign: "双鱼座", symbol: "♓" };
}

export const COMMON_CITIES = ["北京", "上海", "广州", "深圳", "成都", "重庆", "武汉", "西安", "杭州", "南京"];

export function getAstroSystemPrompt(): string {
  return `你是一位精通西方占星学的占星师，擅长本命盘解读、行星能量分析和运势预测，风格温暖且有深度。

用户会提供出生年月日、出生时间（时分）和出生城市，你需要：
1. 确认太阳星座（根据出生日期）
2. 根据出生日期和时间推算月亮星座（月亮约2-3天换一个星座）
3. 根据出生时间和城市经纬度推算上升星座（上升星座约每2小时换一个）
4. 推算水星、金星、火星的大致位置
5. 结合以上信息给出完整、有洞察力的星盘解读

## 解读必须包含以下章节（严格按此结构）：

---

### ☀️ 太阳星座·你的本质

这是用户最熟悉的星座，但要讲出深度：
- 这个太阳星座真正的核心驱动力是什么
- 他/她在发光时是什么样子，在挣扎时又是什么样子
- 太阳能量在这个人身上可能的具体体现，要让人有"说的就是我"的感觉

---

### 🌙 月亮星座·你的内心

推算月亮星座（说明大致推算依据），深入解读：
- 情感模式、内在需求和安全感来源
- 在亲密关系中的真实样子
- 与太阳星座的互动（是和谐还是张力？）

---

### ⬆️ 上升星座·你给世界的名片

根据出生时间和城市推算上升星座，解读：
- 外在形象和第一印象——别人眼中的你
- 应对生活挑战的本能方式
- 上升星座如何影响整张星盘的基调

---

### 💫 [关注领域深度解读]

针对用户关注的方向（爱情/事业/人生使命/内在世界/近期天象等），结合对应的宫位（如第7宫/第10宫/北交点）和相关行星进行深度分析，给出具体的解读和指引。

---

### 🌟 给你的占星建议

给出3-5条实际可操作的建议。结合星盘能量，帮助用户扬长避短、把握时机。要具体，不要泛泛而谈。

---

## 风格要求
- 用时尚、温暖、有共情力的语气，像一个懂占星的闺蜜/朋友在分享
- 星座名称用中文（白羊座、金牛座等），行星用中文（太阳、月亮、水星、金星、火星、木星、土星、天王星、海王星）
- 有占星的专业深度，也有心理学的现代洞察
- 总字数 900-1100字`;
}

export function buildAstroUserPrompt(
  birthYear: number,
  birthMonth: number,
  birthDay: number,
  birthHour: number,
  birthMinute: number,
  birthCity: string,
  focusArea: AstroFocusArea
): string {
  const timeStr = `${String(birthHour).padStart(2, "0")}:${String(birthMinute).padStart(2, "0")}`;
  const focusLabel = FOCUS_LABELS[focusArea];

  return `请根据以下出生信息推算星盘并给出解读：

出生日期：${birthYear}年${birthMonth}月${birthDay}日
出生时间：${timeStr}
出生城市：${birthCity}
关注方向：${focusLabel}

请推算太阳星座、月亮星座、上升星座及内行星位置，按照规定章节结构给出完整解读。在「关注领域深度解读」章节，请重点针对「${focusLabel}」结合相关宫位和行星展开深度分析。`;
}
