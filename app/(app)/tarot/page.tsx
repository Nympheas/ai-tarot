"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CardDraw } from "@/components/tarot/CardDraw";
import { CardPicker, SelectedCard } from "@/components/tarot/CardPicker";
import { ReadingOutput } from "@/components/tarot/ReadingOutput";
import { TarotCard } from "@/lib/divination/tarot-cards";
import { saveReading } from "@/lib/storage";
import { ReadingLoader } from "@/components/ReadingLoader";
import { PaywallModal } from "@/components/PaywallModal";
import { RetryCountdown } from "@/components/RetryCountdown";

type DrawnCard = TarotCard & { isReversed: boolean; position: string };
type Message = { role: "user" | "assistant"; content: string };
type Mode = "auto" | "manual";
type Step = "question" | "draw" | "reading";

export default function TarotPage() {
  const [mode, setMode] = useState<Mode>("auto");
  const [step, setStep] = useState<Step>("question");
  const [question, setQuestion] = useState("");
  const [drawnCards, setDrawnCards] = useState<DrawnCard[]>([]);
  const [output, setOutput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [quotaError, setQuotaError] = useState<{ retryAfter?: number } | null>(null);
  const [showPaywall, setShowPaywall] = useState(false);

  async function startReading(cards: DrawnCard[]) {
    setStep("reading");
    setOutput("");
    setIsStreaming(true);

    const payload = { type: "tarot", question, cards, messages };

    const res = await fetch("/api/divination", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setIsStreaming(false);
      if (res.status === 402) { setShowPaywall(true); setStep("question"); return; }
      setQuotaError({ retryAfter: res.status === 429 ? (data.retryAfter ?? 60) : undefined });
      return;
    }
    if (!res.body) return;
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let full = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value);
      full += chunk;
      setOutput(full);
    }

    setIsStreaming(false);
    setMessages((prev) => [
      ...prev,
      { role: "user", content: question },
      { role: "assistant", content: full },
    ]);
    saveReading({ type: "tarot", question, result: full, metadata: { cards } });
  }

  async function handleFollowUp(followUpQuestion: string) {
    setIsStreaming(true);
    const newMessages: Message[] = [...messages, { role: "user", content: followUpQuestion }];

    const res = await fetch("/api/divination", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "tarot", question: followUpQuestion, cards: drawnCards, messages: newMessages }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setIsStreaming(false);
      setQuotaError({ retryAfter: res.status === 429 ? (data.retryAfter ?? 60) : undefined });
      return;
    }
    if (!res.body) return;
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let reply = "";

    setOutput((prev) => prev + "\n\n---\n\n**你问：** " + followUpQuestion + "\n\n");

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value);
      reply += chunk;
      setOutput((prev) => prev + chunk);
    }

    setIsStreaming(false);
    setMessages([...newMessages, { role: "assistant", content: reply }]);
  }

  function handleCardsDrawn(cards: DrawnCard[]) {
    setDrawnCards(cards);
    startReading(cards);
  }

  function handleManualConfirm(cards: SelectedCard[]) {
    setDrawnCards(cards);
    startReading(cards);
  }

  function reset() {
    setStep("question");
    setQuestion("");
    setDrawnCards([]);
    setOutput("");
    setMessages([]);
    setQuotaError(null);
  }

  function switchMode(m: Mode) {
    setMode(m);
    reset();
  }

  const spreadLabel = drawnCards.length === 5 ? "五牌阵" : "三牌阵";

  return (
    <>
    <PaywallModal open={showPaywall} onClose={() => setShowPaywall(false)} />
    <main className="min-h-screen bg-[#0a0a1a] text-white px-4 py-12">
      <div className="max-w-2xl mx-auto flex flex-col items-center gap-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-3xl font-light tracking-widest text-purple-200">塔罗解读</h1>
          <p className="text-slate-400 mt-2 text-sm">
            {step === "reading" && drawnCards.length > 0
              ? `${spreadLabel} · ${drawnCards.map((c) => c.nameZh).join(" · ")}`
              : mode === "auto"
              ? "三牌阵 · 过去 · 现在 · 未来"
              : "手动选牌 · 3 或 5 张"}
          </p>
        </motion.div>

        {/* Mode toggle — only show before reading starts */}
        {step !== "reading" && (
          <div className="flex gap-2 bg-white/5 rounded-full p-1">
            <button
              onClick={() => switchMode("auto")}
              className={`px-5 py-2 rounded-full text-sm transition-colors ${
                mode === "auto" ? "bg-purple-600 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              AI 自动抽牌
            </button>
            <button
              onClick={() => switchMode("manual")}
              className={`px-5 py-2 rounded-full text-sm transition-colors ${
                mode === "manual" ? "bg-purple-600 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              手动选牌
            </button>
          </div>
        )}

        {/* Step 1: Question */}
        {step === "question" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full flex flex-col gap-4"
          >
            <label className="text-slate-300 text-sm text-center">
              在心中默想你的问题，然后写下来
            </label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="例如：我的事业发展方向是什么？"
              rows={3}
              className="w-full rounded-2xl bg-slate-900/80 border border-purple-500/30 text-white placeholder:text-slate-500 px-5 py-4 text-sm outline-none focus:border-purple-400 transition-colors resize-none"
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={!question.trim()}
              onClick={() => setStep("draw")}
              className="w-full py-4 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium disabled:opacity-40 shadow-lg shadow-purple-500/20 cursor-pointer"
            >
              {mode === "auto" ? "准备好了，开始抽牌" : "准备好了，选择牌"}
            </motion.button>
          </motion.div>
        )}

        {/* Step 2: Draw / Pick */}
        {step === "draw" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full flex flex-col items-center gap-6">
            {mode === "auto" ? (
              <>
                <p className="text-slate-400 text-sm text-center">静心片刻，专注于你的问题</p>
                <CardDraw onCardsDrawn={handleCardsDrawn} />
              </>
            ) : (
              <>
                <p className="text-slate-400 text-sm text-center">
                  选择你已经抽到的牌，并设置正位或逆位
                </p>
                <CardPicker onConfirm={handleManualConfirm} />
              </>
            )}
          </motion.div>
        )}

        {/* Step 3: Reading */}
        {step === "reading" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full flex flex-col items-center gap-6">
            {!output && isStreaming && <ReadingLoader />}
            {quotaError && (
              quotaError.retryAfter
                ? <RetryCountdown
                    retryAfter={quotaError.retryAfter}
                    onRetry={() => { setQuotaError(null); startReading(drawnCards); }}
                    onDismiss={reset}
                  />
                : <div className="w-full rounded-2xl border border-amber-500/20 bg-amber-900/10 px-6 py-5 flex flex-col gap-3">
                    <p className="text-amber-400/90 font-medium">请求失败</p>
                    <p className="text-slate-400 text-sm">请稍后重试</p>
                    <button onClick={reset} className="text-slate-500 text-xs hover:text-slate-300 cursor-pointer text-left">返回重新占卜 →</button>
                  </div>
            )}
            {output && (
              <ReadingOutput
                content={output}
                isStreaming={isStreaming}
                onFollowUp={handleFollowUp}
              />
            )}
            {!isStreaming && output && (
              <button
                onClick={reset}
                className="text-slate-600 text-xs hover:text-slate-400 transition-colors cursor-pointer pb-20"
              >
                开始新的占卜
              </button>
            )}
          </motion.div>
        )}
      </div>
    </main>
    </>
  );
}
