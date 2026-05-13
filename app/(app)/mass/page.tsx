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
type Step = "theme" | "question" | "group" | "reading";

const THEMES: { key: MassTheme; label: string; emoji: string; desc: string }[] = [
  { key: "love",    label: "感情运势",     emoji: "💕", desc: "爱情·关系·缘分" },
  { key: "career",  label: "事业学业",     emoji: "🚀", desc: "工作·考试·成长" },
  { key: "wealth",  label: "财富资源",     emoji: "✨", desc: "金钱·机遇·丰盛" },
  { key: "energy",  label: "近期整体能量", emoji: "🌙", desc: "综合运势·本周能量" },
];

const POPULAR_QUESTIONS: Record<MassTheme, string[]> = {
  love: [
    "他/她对我有感情吗？",
    "我们有未来吗？",
    "我何时能遇到对的人？",
    "我们现在的关系走向如何？",
    "分开后还有复合的可能吗？",
    "我该主动还是等待？",
  ],
  career: [
    "我现在的工作方向对吗？",
    "跳槽的时机到了吗？",
    "我适合创业吗？",
    "我的副业能做起来吗？",
    "考试/面试会顺利吗？",
    "我的努力会被看见吗？",
  ],
  wealth: [
    "近期财运如何？",
    "我的投资会有回报吗？",
    "什么时候会有大的进账？",
    "我适合做生意吗？",
    "有意外之财的可能吗？",
    "我的偏财运怎么样？",
  ],
  energy: [
    "近期我的整体能量如何？",
    "有什么事情需要我注意的？",
    "我该放手哪些东西？",
    "最近有什么好的转机吗？",
    "我现在的状态适合行动吗？",
    "宇宙想告诉我什么？",
  ],
};

export default function MassPage() {
  const [step, setStep] = useState<Step>("theme");
  const [theme, setTheme] = useState<MassTheme>("love");
  const [question, setQuestion] = useState("");
  const [selectedGroup, setSelectedGroup] = useState<typeof GROUPS[number] | null>(null);
  const [output, setOutput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  function handleThemeSelect(t: MassTheme) {
    setTheme(t);
    setQuestion("");
    setStep("question");
  }

  function handleQuestionConfirm() {
    if (!question.trim()) return;
    setStep("group");
  }

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
        question,
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
      { role: "user", content: `第${group.number}组 · ${THEME_LABELS[theme]} · ${question}` },
      { role: "assistant", content: full },
    ]);
    saveReading({
      type: "tarot",
      question: `大众占卜 · ${THEME_LABELS[theme]} · ${question}`,
      result: full,
      metadata: { massTheme: theme, group: group.number, question, cards },
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
        question: followUpQuestion,
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
    setQuestion("");
    setOutput("");
    setMessages([]);
  }

  const currentTheme = THEMES.find((t) => t.key === theme);

  return (
    <main className="min-h-screen bg-[#080814] text-white px-4 py-12 pb-28">
      <div className="max-w-2xl mx-auto flex flex-col items-center gap-10">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <h1 className="text-3xl font-light tracking-widest text-pink-200">大众占卜</h1>
          <p className="text-slate-500 mt-2 text-sm">选择主题 · 输入问题 · 跟随直觉</p>
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
                  onClick={() => handleThemeSelect(t.key)}
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

        {/* Step 2: Question */}
        {step === "question" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full flex flex-col gap-5">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2">
              <span className="text-xl">{currentTheme?.emoji}</span>
              <span className="text-white font-medium text-sm">{currentTheme?.label}</span>
              <button onClick={() => setStep("theme")} className="text-slate-600 text-xs ml-1 hover:text-slate-400 cursor-pointer">
                换主题
              </button>
            </div>

            <p className="text-slate-400 text-sm">你想问什么？</p>

            {/* Popular questions */}
            <div className="flex flex-wrap gap-2">
              {POPULAR_QUESTIONS[theme].map((q) => (
                <motion.button
                  key={q}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setQuestion(q)}
                  className={`px-3 py-1.5 rounded-full text-xs border transition-all cursor-pointer ${
                    question === q
                      ? "border-pink-400 bg-pink-500/20 text-pink-200"
                      : "border-slate-700 text-slate-400 hover:border-pink-500/40 hover:text-slate-300"
                  }`}
                >
                  {q}
                </motion.button>
              ))}
            </div>

            {/* Custom input */}
            <div className="flex flex-col gap-2">
              <p className="text-slate-600 text-xs">或者自己输入</p>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="写下你心里的问题..."
                rows={2}
                className="w-full rounded-2xl bg-slate-900/60 border border-pink-500/20 text-white placeholder:text-slate-600 px-4 py-3 text-sm outline-none focus:border-pink-400/50 transition-colors resize-none"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={!question.trim()}
              onClick={handleQuestionConfirm}
              className="w-full py-4 rounded-full bg-gradient-to-r from-pink-600 to-rose-600 text-white font-medium disabled:opacity-30 shadow-lg shadow-pink-500/20 cursor-pointer"
            >
              确认问题，选择牌组
            </motion.button>
          </motion.div>
        )}

        {/* Step 3: Group Selection */}
        {step === "group" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full flex flex-col items-center gap-6">
            <div className="w-full flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-xl">{currentTheme?.emoji}</span>
                <span className="text-white font-medium text-sm">{currentTheme?.label}</span>
                <button onClick={() => setStep("question")} className="text-slate-600 text-xs ml-1 hover:text-slate-400 cursor-pointer">
                  改问题
                </button>
              </div>
              <p className="text-pink-300/70 text-sm truncate">「{question}」</p>
            </div>
            <GroupSelect onSelect={startReading} />
          </motion.div>
        )}

        {/* Step 4: Reading */}
        {step === "reading" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full flex flex-col items-center gap-6">
            <AnimatePresence>
              {selectedGroup && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center gap-1"
                >
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-pink-500/20 bg-pink-900/10">
                    <span>{selectedGroup.symbol}</span>
                    <span className="text-pink-200 text-sm">第 {selectedGroup.number} 组 · {THEME_LABELS[theme]}</span>
                  </div>
                  <p className="text-slate-500 text-xs">「{question}」</p>
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
                重新占卜
              </button>
            )}
          </motion.div>
        )}
      </div>
    </main>
  );
}
