import OpenAI from "openai";
import { getTarotSystemPrompt, buildTarotUserPrompt } from "@/lib/prompts/tarot";
import { getIChingSystemPrompt, buildIChingUserPrompt } from "@/lib/prompts/iching";
import { getMassSystemPrompt, buildMassUserPrompt, MassTheme } from "@/lib/prompts/mass";
import { getZiweiSystemPrompt, buildZiweiUserPrompt, ZiweiFocusArea } from "@/lib/prompts/ziwei";
import { getAstroSystemPrompt, buildAstroUserPrompt, AstroFocusArea } from "@/lib/prompts/astro";

type DivinationType = "tarot" | "iching" | "mass" | "ziwei" | "astro";
type Message = { role: "user" | "assistant"; content: string };

function getSystemPrompt(type: DivinationType): string {
  if (type === "iching") return getIChingSystemPrompt();
  if (type === "mass")   return getMassSystemPrompt();
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

export async function POST(req: Request) {
  const body = await req.json();
  const { type, messages = [] }: { type: DivinationType; messages: Message[] } = body;

  // Mock mode
  if (
    process.env.NEXT_PUBLIC_USE_MOCK === "true" ||
    !process.env.ARK_API_KEY ||
    process.env.ARK_API_KEY === "your_ark_api_key_here"
  ) {
    const mockText = getMockResponse(type);
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
    const client = new OpenAI({
      apiKey: process.env.ARK_API_KEY!,
      baseURL: process.env.ARK_BASE_URL || "https://ark.cn-beijing.volces.com/api/v3",
    });

    const systemPrompt = getSystemPrompt(type);
    const userPrompt   = buildUserPrompt(type, body);

    const oaiMessages: { role: "system" | "user" | "assistant"; content: string }[] = [
      { role: "system", content: systemPrompt },
      ...messages.map((m: Message) => ({ role: m.role, content: m.content })),
      { role: "user", content: userPrompt },
    ];

    const arkStream = await client.chat.completions.create({
      model: process.env.ARK_MODEL || "doubao-1-5-pro-32k",
      messages: oaiMessages,
      stream: true,
      max_tokens: 16384,
      temperature: 0.95,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of arkStream) {
          const text = chunk.choices[0]?.delta?.content ?? "";
          if (text) controller.enqueue(encoder.encode(text));
        }
        controller.close();
      },
    });

    return new Response(readable, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("[divination] Doubao error:", message);

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
