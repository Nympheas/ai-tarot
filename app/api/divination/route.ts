import { getMassBookSystemPrompt, buildMassBookUserPrompt, getMassBookMock } from "@/lib/prompts/mass-book";
import { withTwentyCardSpread, buildTwentyCardUserPrompt, isTwentyCardReading, getTwentyCardMock } from "@/lib/prompts/mass-twenty-card";
import { withFifteenCardSpread, buildFifteenCardUserPrompt, isFifteenCardReading, getFifteenCardMock } from "@/lib/prompts/mass-fifteen-card";
import { withThirteenCardSpread, buildThirteenCardUserPrompt, isThirteenCardReading, getThirteenCardMock } from "@/lib/prompts/mass-thirteen-card";
import { withAddedCardSpread, buildAddedCardUserPrompt, isAddedReading, getAddedCardMock } from "@/lib/prompts/mass-added-card";
import { withFourCardSpread, buildFourCardUserPrompt, isFourCardReading, getFourCardMock } from "@/lib/prompts/mass-four-card";
import { withThreeCardSpread, buildThreeCardUserPrompt, isThreeCardReading, getThreeCardMock } from "@/lib/prompts/mass-three-card";
import { GoogleGenerativeAI, Content, GenerationConfig } from "@google/generative-ai";
import { auth } from "@clerk/nextjs/server";
import { getUserCreditStatus, consumeCredit } from "@/lib/credits";
import { getTarotSystemPrompt, buildTarotUserPrompt } from "@/lib/prompts/tarot";
import { getIChingSystemPrompt, buildIChingUserPrompt } from "@/lib/prompts/iching";
import { getMassSystemPrompt, getMassINTPSystemPrompt, buildMassUserPrompt, MassTheme, MassPersonality } from "@/lib/prompts/mass";
import { getZiweiSystemPrompt, buildZiweiUserPrompt, ZiweiFocusArea } from "@/lib/prompts/ziwei";
import { getAstroSystemPrompt, buildAstroUserPrompt, AstroFocusArea } from "@/lib/prompts/astro";

type DivinationType = "tarot" | "iching" | "mass" | "ziwei" | "astro";
type Message = { role: "user" | "assistant"; content: string };

function getSystemPrompt(type: DivinationType, body: Record<string, unknown>): string {
  if (type === "iching") return getIChingSystemPrompt();
  if (type === "mass") {
    const personality = (body.personality as MassPersonality) ?? "default";
    const prompt = personality === "book" ? getMassBookSystemPrompt() : personality === "intp" ? getMassINTPSystemPrompt() : getMassSystemPrompt();
    if (body.spread === "twenty-card") return withTwentyCardSpread(prompt, personality);
    if (body.spread === "fifteen-card") return withFifteenCardSpread(prompt, personality);
    if (body.spread === "thirteen-card") return withThirteenCardSpread(prompt, personality);
    if (body.spread === "added-card") return withAddedCardSpread(prompt, personality);
    if (body.spread === "four-card") return withFourCardSpread(prompt, personality);
    return body.spread === "three-card" ? withThreeCardSpread(prompt, personality) : prompt;
  }
  if (type === "ziwei")  return getZiweiSystemPrompt();
  if (type === "astro")  return getAstroSystemPrompt();
  return getTarotSystemPrompt();
}

function buildUserPrompt(type: DivinationType, body: Record<string, unknown>): string {
  if (type === "tarot") {
    return buildTarotUserPrompt(
      body.question as string,
      body.cards as Array<{ nameZh: string; name: string; isReversed: boolean; position?: string }>
    );
  }
  if (type === "iching") {
    return buildIChingUserPrompt(
      body.question as string,
      body.hexagramName as string,
      body.hexagramNumber as number
    );
  }
  if (type === "mass") {
    if (body.spread === "twenty-card" && isTwentyCardReading(body.readingCards)) {
      return buildTwentyCardUserPrompt(body.theme as MassTheme, body.groupNumber as number, body.groupSymbol as string, body.question as string, body.readingCards);
    }
    if (body.spread === "fifteen-card" && isFifteenCardReading(body.readingCards)) {
      return buildFifteenCardUserPrompt(body.theme as MassTheme, body.groupNumber as number, body.groupSymbol as string, body.question as string, body.readingCards);
    }
    if (body.spread === "thirteen-card" && isThirteenCardReading(body.readingCards)) {
      return buildThirteenCardUserPrompt(body.theme as MassTheme, body.groupNumber as number, body.groupSymbol as string, body.question as string, body.readingCards);
    }
    if (body.spread === "added-card" && isAddedReading(body)) {
      return buildAddedCardUserPrompt(body.theme as MassTheme, body.groupNumber as number, body.groupSymbol as string, body.question as string, body);
    }
    if (body.spread === "four-card" && isFourCardReading(body.readingCards)) {
      return buildFourCardUserPrompt(
        body.theme as MassTheme, body.groupNumber as number, body.groupSymbol as string,
        body.question as string, body.readingCards
      );
    }
    if (body.spread === "three-card" && isThreeCardReading(body.readingCards)) {
      return buildThreeCardUserPrompt(
        body.theme as MassTheme, body.groupNumber as number, body.groupSymbol as string,
        body.question as string, body.readingCards
      );
    }
    if (body.personality === "book") return buildMassBookUserPrompt(
      body.theme as MassTheme,
      body.groupNumber as number,
      body.groupSymbol as string,
      (body.question as string) ?? "",
      body.verificationCards as Array<{ nameZh: string; name: string; isReversed: boolean }>,
      body.readingCards as Array<{ nameZh: string; name: string; isReversed: boolean }>
    );
    return buildMassUserPrompt(
      body.theme as MassTheme,
      body.groupNumber as number,
      body.groupSymbol as string,
      (body.question as string) ?? "",
      body.verificationCards as Array<{ nameZh: string; name: string; isReversed: boolean }>,
      body.readingCards as Array<{ nameZh: string; name: string; isReversed: boolean }>
    );
  }
  if (type === "ziwei") {
    return buildZiweiUserPrompt(
      body.birthYear as number,
      body.birthMonth as number,
      body.birthDay as number,
      body.shichen as string,
      body.shichenRange as string,
      body.gender as "male" | "female",
      body.focusArea as ZiweiFocusArea
    );
  }
  if (type === "astro") {
    return buildAstroUserPrompt(
      body.birthYear as number,
      body.birthMonth as number,
      body.birthDay as number,
      body.birthHour as number,
      body.birthMinute as number,
      body.birthCity as string,
      body.focusArea as AstroFocusArea
    );
  }
  return body.question as string;
}

function toGeminiHistory(messages: Message[]): Content[] {
  return messages.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));
}

export async function POST(req: Request) {
  const body = await req.json();
  const { type, messages = [] }: { type: DivinationType; messages: Message[] } = body;

  if (type === "mass" && body.spread === "three-card" &&
      (!isThreeCardReading(body.readingCards) || typeof body.question !== "string" || !body.question.trim())) {
    return Response.json({ error: "三张牌解读需要一个问题和三张牌" }, { status: 400 });
  }

  if (type === "mass" && body.spread === "four-card" &&
      (!isFourCardReading(body.readingCards) || typeof body.question !== "string" || !body.question.trim())) {
    return Response.json({ error: "四张牌关系解读需要一个问题和四张牌" }, { status: 400 });
  }

  if (type === "mass" && body.spread === "added-card" &&
      (!isAddedReading(body) || typeof body.question !== "string" || !body.question.trim())) {
    return Response.json({ error: "加牌解读需要三张或四张基础牌；每次加牌须指定已有牌、明确目的及一至两张不重复的补充牌" }, { status: 400 });
  }

  if (type === "mass" && body.spread === "thirteen-card" &&
      (!isThirteenCardReading(body.readingCards) || typeof body.question !== "string" || !body.question.trim())) {
    return Response.json({ error: "十三张牌目前生活解读需要一个问题和十三张不重复的牌" }, { status: 400 });
  }

  if (type === "mass" && body.spread === "twenty-card" &&
      (!isTwentyCardReading(body.readingCards) || typeof body.question !== "string" || !body.question.trim())) {
    return Response.json({ error: "二十张牌关系解读需要一个问题和二十张不重复的牌" }, { status: 400 });
  }

  if (type === "mass" && body.spread === "fifteen-card" &&
      (!isFifteenCardReading(body.readingCards) || typeof body.question !== "string" || !body.question.trim())) {
    return Response.json({ error: "十五张牌问题解读需要一个问题和十五张不重复的牌" }, { status: 400 });
  }

  // Auth + credit check (only for new readings, not follow-up messages)
  if (messages.length === 0 || (type === "mass" && body.spread === "added-card")) {
    const { userId } = await auth();
    if (!userId) {
      return new Response(JSON.stringify({ error: "unauthenticated" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
    const status = await getUserCreditStatus(userId);
    if (!status.canRead) {
      return new Response(JSON.stringify({ error: "payment_required" }), {
        status: 402,
        headers: { "Content-Type": "application/json" },
      });
    }
    await consumeCredit(userId);
  }

  // Mock mode
  if (
    process.env.NEXT_PUBLIC_USE_MOCK === "true" ||
    !process.env.GEMINI_API_KEY ||
    process.env.GEMINI_API_KEY === "your_gemini_api_key_here"
  ) {
    const mockText = type === "mass" && body.spread === "twenty-card"
      ? getTwentyCardMock(body.readingCards)
      : type === "mass" && body.spread === "fifteen-card"
      ? getFifteenCardMock(body.readingCards)
      : type === "mass" && body.spread === "thirteen-card"
      ? getThirteenCardMock(body.readingCards)
      : type === "mass" && body.spread === "added-card"
      ? getAddedCardMock(body)
      : type === "mass" && body.spread === "four-card"
      ? getFourCardMock(body.readingCards)
      : type === "mass" && body.spread === "three-card"
      ? getThreeCardMock(body.readingCards)
      : type === "mass" && body.personality === "book"
      ? getMassBookMock(body.verificationCards, body.readingCards)
      : getMockResponse(type);
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const words = mockText.split(" ");
        for (const word of words) {
          controller.enqueue(encoder.encode(word + " "));
          await new Promise((r) => setTimeout(r, 25));
        }
        controller.close();
      },
    });
    return new Response(stream, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
  }

  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
    const systemPrompt = getSystemPrompt(type, body);
    const userPrompt   = buildUserPrompt(type, body);

    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
      systemInstruction: systemPrompt,
      generationConfig: {
        maxOutputTokens: 65536,
        temperature: 0.95,
      } as unknown as GenerationConfig,
    });

    const chat = model.startChat({ history: toGeminiHistory(messages) });
    const result = await chat.sendMessageStream(userPrompt);

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of result.stream) {
          const text = chunk.text();
          if (text) controller.enqueue(encoder.encode(text));
        }
        controller.close();
      },
    });

    return new Response(readable, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[divination] Gemini error:", message);

    if (message.includes("429") || message.includes("rate_limit") || message.includes("quota")) {
      const retryMatch = message.match(/(\d+)\s*s/i);
      const retryAfter = retryMatch ? parseInt(retryMatch[1]) : 60;
      return new Response(JSON.stringify({ error: "quota_exceeded", retryAfter }), {
        status: 429,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

function getMockResponse(type: DivinationType): string {
  if (type === "iching") {
    return `## 卦象：乾卦（第一卦）

**卦辞原文**：元，亨，利，贞。

---

## 卦辞解读

"元亨利贞"四字，是《周易》中最高的评价。元，万物之始；亨，通达顺畅；利，有利有益；贞，坚守正道。此卦纯阳至刚，象征天道运行，自强不息。

---

## 当前处境

你所问之事，正处于**充满潜力的蓄势阶段**。乾卦的能量提醒你：此刻宜保持内心的清明与坚定，如同龙潜深渊，蓄积力量。外在环境虽有变化，但你的核心意志是稳固的。

---

## 变化趋势

乾卦初爻曰"潜龙勿用"，但九五爻曰"飞龙在天"。这意味着**时机正在成熟**，只需按正道行事，待时而动，飞跃终将到来。

---

## 行动指引

1. **保持内心笃定** — 不因外界议论而动摇，乾卦最忌朝令夕改
2. **主动而不冒进** — 时机未到时积累实力，时机一到则果断行动`;
  }

  return `## 牌阵概览

三张牌的能量组合呈现出一段正在经历深刻内在转化的旅程。整体能量充满了蜕变与希望的张力。

---

## 逐牌解读

### 第一张牌：过去 — 死神（正位）

死神牌象征着**一个旧阶段正在完成**。曾经依赖的身份认同或生活方式，已走到自然的终点。正是这场告别，为你开辟了全新的空间。

### 第二张牌：现在 — 星星（正位）

星星带来了**疗愈与希望的能量**。你正处于一种脆弱而美好的重建状态——灵感正在悄悄涌现，开始相信可能性。

### 第三张牌：未来 — 战车（正位）

战车象征着**以坚定意志突破障碍**。整合了过去的经验，你将有能力驾驭生命中的对立力量，朝着清晰的方向前进。

---

## 综合启示

这三张牌讲述了**从结束到疗愈，再到胜利前行**的完整故事。你正站在重要的转折点——旧的已去，新的正在成形。

---

## 行动建议

1. **允许自己处于"之间"的状态** — 蜕变需要时间，不要强迫立刻给出答案
2. **记录你的直觉与灵感** — 把洞见写下来，将成为前行的罗盘`;
}
