"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CoinThrow } from "@/components/iching/CoinThrow";
import { ReadingOutput } from "@/components/tarot/ReadingOutput";
import { saveReading } from "@/lib/storage";
import { ReadingLoader } from "@/components/ReadingLoader";

type Message = { role: "user" | "assistant"; content: string };
type Step = "question" | "throw" | "reading";

export default function IChingPage() {
  const [step, setStep] = useState<Step>("question");
  const [question, setQuestion] = useState("");
  const [hexagramName, setHexagramName] = useState("");
  const [hexagramNumber, setHexagramNumber] = useState(0);
  const [output, setOutput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [quotaError, setQuotaError] = useState<{ retryAfter?: number } | null>(null);

  async function startReading(name: string, number: number) {
    setHexagramName(name);
    setHexagramNumber(number);
    setStep("reading");
    setOutput("");
    setIsStreaming(true);

    const res = await fetch("/api/divination", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "iching", question, hexagramName: name, hexagramNumber: number, messages }),
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
    let full = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      full += decoder.decode(value);
      setOutput(full);
    }

    setIsStreaming(false);
    setMessages([
      { role: "user", content: question },
      { role: "assistant", content: full },
    ]);
    saveReading({ type: "iching", question, result: full, metadata: { hexagramName: name, hexagramNumber: number } });
  }

  async function handleFollowUp(followUpQuestion: string) {
    setIsStreaming(true);
    const newMessages: Message[] = [...messages, { role: "user", content: followUpQuestion }];

    const res = await fetch("/api/divination", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "iching", question: followUpQuestion, hexagramName, hexagramNumber, messages: newMessages }),
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

  function reset() {
    setStep("question");
    setQuestion("");
    setOutput("");
    setMessages([]);
    setQuotaError(null);
  }

  return (
    <main className="min-h-screen bg-[#0d0a06] text-white px-4 py-12">
      <div className="max-w-2xl mx-auto flex flex-col items-center gap-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="text-3xl font-light tracking-widest text-amber-200">易经起卦</h1>
          <p className="text-stone-400 mt-2 text-sm">三钱法 · 六爻成卦 · AI 解读</p>
        </motion.div>

        {/* Step 1: Question */}
        {step === "question" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full flex flex-col gap-4">
            <label className="text-stone-300 text-sm text-center">
              心中默念你的问题，写下来，然后开始摇卦
            </label>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="例如：我与对方的缘分如何？"
              rows={3}
              className="w-full rounded-2xl bg-stone-900/80 border border-amber-500/20 text-white placeholder:text-stone-600 px-5 py-4 text-sm outline-none focus:border-amber-400/50 transition-colors resize-none"
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={!question.trim()}
              onClick={() => setStep("throw")}
              className="w-full py-4 rounded-full bg-gradient-to-r from-amber-600 to-orange-600 text-white font-medium disabled:opacity-40 shadow-lg shadow-amber-500/20 cursor-pointer"
            >
              开始起卦
            </motion.button>
          </motion.div>
        )}

        {/* Step 2: Throw coins */}
        {step === "throw" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full flex flex-col items-center gap-6">
            <p className="text-stone-400 text-sm text-center">
              静心专注，依次摇出六爻
            </p>
            <CoinThrow onComplete={startReading} />
          </motion.div>
        )}

        {/* Step 3: Reading */}
        {step === "reading" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full flex flex-col items-center gap-6">
            {!output && isStreaming && <ReadingLoader />}
            {quotaError && (
              <div className="w-full rounded-2xl border border-amber-500/20 bg-amber-900/10 px-6 py-5 flex flex-col gap-3">
                <p className="text-amber-400/90 font-medium">今日免费额度已用完</p>
                <p className="text-stone-400 text-sm leading-relaxed">
                  Gemini 免费版每天限 20 次请求。
                  {quotaError.retryAfter
                    ? `请等约 ${quotaError.retryAfter} 秒后重试，或`
                    : "请"}
                  前往 Google AI Studio 开启计费，配额会提升到每天 1500 次。
                </p>
                <button
                  onClick={reset}
                  className="text-stone-500 text-xs hover:text-stone-300 cursor-pointer text-left"
                >
                  返回重新起卦 →
                </button>
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
                className="text-stone-600 text-xs hover:text-stone-400 transition-colors cursor-pointer pb-20"
              >
                重新起卦
              </button>
            )}
          </motion.div>
        )}
      </div>
    </main>
  );
}
