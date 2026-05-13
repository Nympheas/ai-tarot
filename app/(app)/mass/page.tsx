"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { ReadingLoader } from "@/components/ReadingLoader";
import { drawCards } from "@/lib/divination/tarot-cards";
import { saveReading } from "@/lib/storage";
import { MassTheme, THEME_LABELS, POPULAR_QUESTIONS } from "@/lib/prompts/mass";

type Step = "setup" | "reading";

const THEMES: { key: MassTheme; label: string; emoji: string; desc: string }[] = [
  { key: "love",   label: "感情运势",     emoji: "💕", desc: "爱情·关系·缘分" },
  { key: "career", label: "事业学业",     emoji: "🚀", desc: "工作·考试·成长" },
  { key: "wealth", label: "财富资源",     emoji: "✨", desc: "金钱·机遇·丰盛" },
  { key: "energy", label: "近期整体能量", emoji: "🌙", desc: "综合运势·本周能量" },
];

const GROUPS = [
  { number: 1, symbol: "🔮", name: "紫水晶", accent: "purple" },
  { number: 2, symbol: "🌙", name: "月光石", accent: "blue" },
  { number: 3, symbol: "✨", name: "黄水晶", accent: "amber" },
] as const;

type GroupState = {
  status: "idle" | "loading" | "done";
  content: string;
};

const ACCENT = {
  purple: { border: "border-purple-500/30", bg: "bg-purple-900/10", btn: "from-purple-600 to-indigo-600", badge: "bg-purple-500/10 text-purple-300 border-purple-500/20" },
  blue:   { border: "border-blue-500/30",   bg: "bg-blue-900/10",   btn: "from-blue-600 to-cyan-600",    badge: "bg-blue-500/10 text-blue-300 border-blue-500/20" },
  amber:  { border: "border-amber-500/30",  bg: "bg-amber-900/10",  btn: "from-amber-600 to-orange-600", badge: "bg-amber-500/10 text-amber-300 border-amber-500/20" },
};

export default function MassPage() {
  const [step, setStep] = useState<Step>("setup");
  const [theme, setTheme] = useState<MassTheme>("love");
  const [question, setQuestion] = useState("");
  const [groups, setGroups] = useState<GroupState[]>([
    { status: "idle", content: "" },
    { status: "idle", content: "" },
    { status: "idle", content: "" },
  ]);

  function updateGroup(index: number, patch: Partial<GroupState>) {
    setGroups((prev) => prev.map((g, i) => (i === index ? { ...g, ...patch } : g)));
  }

  async function generateGroup(index: number) {
    const group = GROUPS[index];
    updateGroup(index, { status: "loading", content: "" });

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

    if (!res.body) { updateGroup(index, { status: "idle" }); return; }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let full = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value);
      full += chunk;
      updateGroup(index, { content: full });
    }

    updateGroup(index, { status: "done", content: full });
    saveReading({
      type: "tarot",
      question: `大众占卜 · ${THEME_LABELS[theme]} · 第${group.number}组 · ${question}`,
      result: full,
      metadata: { massTheme: theme, group: group.number, question, cards },
    });
  }

  function reset() {
    setStep("setup");
    setQuestion("");
    setGroups([
      { status: "idle", content: "" },
      { status: "idle", content: "" },
      { status: "idle", content: "" },
    ]);
  }

  const currentTheme = THEMES.find((t) => t.key === theme)!;
  const anyDone = groups.some((g) => g.status === "done");

  return (
    <main className="min-h-screen bg-[#080814] text-white px-4 py-12 pb-28">
      <div className="max-w-2xl mx-auto flex flex-col items-center gap-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <h1 className="text-3xl font-light tracking-widest text-pink-200">大众占卜</h1>
          <p className="text-slate-500 mt-2 text-sm">为占卜博主生成 · 三组同场解读</p>
        </motion.div>

        {/* Setup */}
        {step === "setup" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full flex flex-col gap-6">

            {/* Theme */}
            <div className="flex flex-col gap-3">
              <p className="text-slate-400 text-sm">选择主题</p>
              <div className="grid grid-cols-2 gap-2">
                {THEMES.map((t) => (
                  <button
                    key={t.key}
                    onClick={() => { setTheme(t.key); setQuestion(""); }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all cursor-pointer text-left ${
                      theme === t.key
                        ? "border-pink-400/60 bg-pink-900/20 text-white"
                        : "border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <span className="text-xl">{t.emoji}</span>
                    <div>
                      <p className="text-sm font-medium">{t.label}</p>
                      <p className="text-xs text-slate-500">{t.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Question */}
            <div className="flex flex-col gap-3">
              <p className="text-slate-400 text-sm">这期的问题</p>
              <div className="flex flex-wrap gap-2">
                {POPULAR_QUESTIONS[theme].map((q) => (
                  <button
                    key={q}
                    onClick={() => setQuestion(q)}
                    className={`px-3 py-1.5 rounded-full text-xs border transition-all cursor-pointer ${
                      question === q
                        ? "border-pink-400 bg-pink-500/20 text-pink-200"
                        : "border-slate-700 text-slate-400 hover:border-pink-500/40 hover:text-slate-300"
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="或自己输入这期主题问题..."
                rows={2}
                className="w-full rounded-2xl bg-slate-900/60 border border-pink-500/20 text-white placeholder:text-slate-600 px-4 py-3 text-sm outline-none focus:border-pink-400/50 transition-colors resize-none"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              disabled={!question.trim()}
              onClick={() => setStep("reading")}
              className="w-full py-4 rounded-full bg-gradient-to-r from-pink-600 to-rose-600 text-white font-medium disabled:opacity-30 shadow-lg shadow-pink-500/20 cursor-pointer"
            >
              进入解读，逐组生成
            </motion.button>
          </motion.div>
        )}

        {/* Reading: 3 groups */}
        {step === "reading" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full flex flex-col gap-5">

            {/* Header info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span>{currentTheme.emoji}</span>
                <span className="text-white text-sm font-medium">{currentTheme.label}</span>
                <span className="text-slate-500 text-xs">·</span>
                <span className="text-pink-300/70 text-xs truncate max-w-[160px]">「{question}」</span>
              </div>
              <button onClick={reset} className="text-slate-600 text-xs hover:text-slate-400 cursor-pointer">
                重新设置
              </button>
            </div>

            {/* Group panels */}
            {GROUPS.map((group, i) => {
              const g = groups[i];
              const ac = ACCENT[group.accent];

              return (
                <motion.div
                  key={group.number}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className={`rounded-2xl border ${ac.border} ${ac.bg} overflow-hidden`}
                >
                  {/* Group header */}
                  <div className="flex items-center justify-between px-5 py-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{group.symbol}</span>
                      <div>
                        <p className="text-white font-medium text-sm">第 {group.number} 组</p>
                        <p className="text-slate-500 text-xs">{group.name}</p>
                      </div>
                      {g.status === "done" && (
                        <span className={`text-xs px-2 py-0.5 rounded-full border ${ac.badge}`}>已生成</span>
                      )}
                    </div>
                    {g.status === "idle" && (
                      <motion.button
                        whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                        onClick={() => generateGroup(i)}
                        className={`px-4 py-2 rounded-full bg-gradient-to-r ${ac.btn} text-white text-xs font-medium cursor-pointer shadow-md`}
                      >
                        生成第 {group.number} 组
                      </motion.button>
                    )}
                    {g.status === "done" && (
                      <button
                        onClick={() => updateGroup(i, { status: "idle", content: "" })}
                        className="text-slate-600 text-xs hover:text-slate-400 cursor-pointer"
                      >
                        重抽
                      </button>
                    )}
                  </div>

                  {/* Content */}
                  <AnimatePresence>
                    {g.status === "loading" && !g.content && (
                      <div className="px-5 pb-5">
                        <ReadingLoader />
                      </div>
                    )}
                    {(g.status === "loading" || g.status === "done") && g.content && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="px-5 pb-6 border-t border-white/5 pt-4"
                      >
                        <div className="prose prose-invert prose-sm max-w-none text-slate-300 leading-relaxed"
                          style={{ fontSize: "0.875rem" }}>
                          <ReactMarkdown
                            components={{
                              h3: ({ children }) => (
                                <h3 className="text-white font-medium text-sm mt-6 mb-2 first:mt-0">{children}</h3>
                              ),
                              p: ({ children }) => (
                                <p className="text-slate-300 text-sm leading-[1.8] mb-3">{children}</p>
                              ),
                              strong: ({ children }) => (
                                <strong className="text-white font-semibold">{children}</strong>
                              ),
                              hr: () => (
                                <div className="my-4 border-t border-white/8" />
                              ),
                              ul: ({ children }) => <ul className="flex flex-col gap-1.5 my-3">{children}</ul>,
                              li: ({ children }) => (
                                <li className="text-slate-300 text-sm pl-3 relative before:absolute before:left-0 before:content-['•'] before:text-pink-400">
                                  {children}
                                </li>
                              ),
                            }}
                          >
                            {g.content}
                          </ReactMarkdown>
                          {g.status === "loading" && (
                            <span className="inline-block w-1.5 h-4 bg-pink-400 rounded-sm animate-pulse ml-0.5 align-middle" />
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}

            {/* Reset button */}
            {anyDone && (
              <motion.button
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                onClick={reset}
                className="text-slate-600 text-xs hover:text-slate-400 transition-colors cursor-pointer text-center pb-2"
              >
                重新开始
              </motion.button>
            )}
          </motion.div>
        )}
      </div>
    </main>
  );
}
