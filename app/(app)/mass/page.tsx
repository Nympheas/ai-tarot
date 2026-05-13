"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GroupSelect, GROUPS } from "@/components/mass/GroupSelect";
import { ReadingOutput } from "@/components/tarot/ReadingOutput";
import { ReadingLoader } from "@/components/ReadingLoader";
import { drawCards } from "@/lib/divination/tarot-cards";
import { saveReading } from "@/lib/storage";
import { MassTheme, THEME_LABELS } from "@/lib/prompts/mass";

type Message = { role: "user" | "assistant"; content: string };
type Step = "theme" | "group" | "reading";

const THEMES: { key: MassTheme; label: string; emoji: string; desc: string }[] = [
  { key: "love", label: "感情运势", emoji: "💕", desc: "爱情·关系·缘分" },
  { key: "career", label: "事业学业", emoji: "🚀", desc: "工作·考试·成长" },
  { key: "wealth", label: "财富资源", emoji: "✨", desc: "金钱·机遇·丰盛" },
  { key: "energy", label: "近期整体能量", emoji: "🌙", desc: "综合运势·本周能量" },
];

export default function MassPage() {
  const [step, setStep] = useState<Step>("theme");
  const [theme, setTheme] = useState<MassTheme>("love");
  const [selectedGroup, setSelectedGroup] = useState<typeof GROUPS[number] | null>(null);
  const [output, setOutput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  async function startReading(group: typeof GROUPS[number]) {
    setSelectedGroup(group);
    setStep("reading");
    setOutput("");
    setIsStreaming(true);

    const cards = drawCards(5).map((c) => ({ ...c, isReversed: Math.random() > 0.5 }));

    const res = await fetch("/api/divination", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "mass",
        theme,
        groupNumber: group.number,
        groupSymbol: group.symbol,
        cards,
        messages: [],
      }),
    });

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
      { role: "user", content: `第${group.number}组 · ${THEME_LABELS[theme]}` },
      { role: "assistant", content: full },
    ]);
    saveReading({
      type: "tarot",
      question: `大众占卜 · ${THEME_LABELS[theme]} · 第${group.number}组`,
      result: full,
      metadata: { massTheme: theme, group: group.number, cards },
    });
  }

  async function handleFollowUp(followUpQuestion: string) {
    setIsStreaming(true);
    const newMessages: Message[] = [...messages, { role: "user", content: followUpQuestion }];

    const res = await fetch("/api/divination", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "mass",
        theme,
        groupNumber: selectedGroup!.number,
        groupSymbol: selectedGroup!.symbol,
        cards: [],
        messages: newMessages,
      }),
    });

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
    setStep("theme");
    setSelectedGroup(null);
    setOutput("");
    setMessages([]);
  }

  return (
    <main className="min-h-screen bg-[#080814] text-white px-4 py-12 pb-28">
      <div className="max-w-2xl mx-auto flex flex-col items-center gap-10">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <h1 className="text-3xl font-light tracking-widest text-pink-200">大众占卜</h1>
          <p className="text-slate-500 mt-2 text-sm">选择主题 · 跟随直觉 · 看见能量</p>
        </motion.div>

        {/* Step 1: Theme */}
        {step === "theme" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full flex flex-col gap-4">
            <p className="text-slate-400 text-sm text-center">今天想看哪方面的能量？</p>
            <div className="grid grid-cols-2 gap-3">
              {THEMES.map((t, i) => (
                <motion.button
                  key={t.key}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => { setTheme(t.key); setStep("group"); }}
                  className="flex flex-col items-center gap-2 py-6 rounded-2xl border border-pink-500/20 bg-gradient-to-b from-pink-900/10 to-transparent hover:border-pink-500/40 transition-all cursor-pointer"
                >
                  <span className="text-3xl">{t.emoji}</span>
                  <span className="text-white font-medium text-sm">{t.label}</span>
                  <span className="text-slate-500 text-xs">{t.desc}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 2: Group Selection */}
        {step === "group" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full flex flex-col items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{THEMES.find((t) => t.key === theme)?.emoji}</span>
              <span className="text-white font-medium">{THEME_LABELS[theme]}</span>
              <button onClick={() => setStep("theme")} className="text-slate-600 text-xs ml-2 hover:text-slate-400 cursor-pointer">
                换主题
              </button>
            </div>
            <GroupSelect onSelect={startReading} />
          </motion.div>
        )}

        {/* Step 3: Reading */}
        {step === "reading" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full flex flex-col items-center gap-6">
            {/* Group & theme badge */}
            <AnimatePresence>
              {selectedGroup && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-3 px-4 py-2 rounded-full border border-pink-500/20 bg-pink-900/10"
                >
                  <span>{selectedGroup.symbol}</span>
                  <span className="text-pink-200 text-sm">第 {selectedGroup.number} 组 · {THEME_LABELS[theme]}</span>
                </motion.div>
              )}
            </AnimatePresence>

            {!output && isStreaming && <ReadingLoader />}
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
                className="text-slate-600 text-xs hover:text-slate-400 transition-colors cursor-pointer pb-4"
              >
                重新选择
              </button>
            )}
          </motion.div>
        )}
      </div>
    </main>
  );
}
