"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { ReadingLoader } from "@/components/ReadingLoader";
import { drawCards, ALL_CARDS } from "@/lib/divination/tarot-cards";
import { saveReading } from "@/lib/storage";
import { MassTheme, THEME_LABELS, POPULAR_QUESTIONS } from "@/lib/prompts/mass";

type Step = "setup" | "reading";
type InputMode = "auto" | "manual";
type CardInput = { name: string; isReversed: boolean };
type GroupCards = { verification: CardInput[]; reading: CardInput[] };

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

type GroupState = { status: "idle" | "loading" | "done" | "error"; content: string; retryAfter?: number };

const ACCENT = {
  purple: { border: "border-purple-500/30", bg: "bg-purple-900/10", btn: "from-purple-600 to-indigo-600", badge: "bg-purple-500/10 text-purple-300 border-purple-500/20", sub: "text-purple-400/70" },
  blue:   { border: "border-blue-500/30",   bg: "bg-blue-900/10",   btn: "from-blue-600 to-cyan-600",    badge: "bg-blue-500/10 text-blue-300 border-blue-500/20",   sub: "text-blue-400/70" },
  amber:  { border: "border-amber-500/30",  bg: "bg-amber-900/10",  btn: "from-amber-600 to-orange-600", badge: "bg-amber-500/10 text-amber-300 border-amber-500/20", sub: "text-amber-400/70" },
};

const emptyGroupCards = (): GroupCards => ({
  verification: Array(3).fill(null).map(() => ({ name: "", isReversed: false })),
  reading:      Array(5).fill(null).map(() => ({ name: "", isReversed: false })),
});

export default function MassPage() {
  const [step, setStep]       = useState<Step>("setup");
  const [theme, setTheme]     = useState<MassTheme>("love");
  const [question, setQuestion] = useState("");
  const [inputMode, setInputMode] = useState<InputMode>("auto");
  const [manualCards, setManualCards] = useState<GroupCards[]>([
    emptyGroupCards(), emptyGroupCards(), emptyGroupCards(),
  ]);
  const [groups, setGroups] = useState<GroupState[]>([
    { status: "idle", content: "" },
    { status: "idle", content: "" },
    { status: "idle", content: "" },
  ]);

  function updateGroup(index: number, patch: Partial<GroupState>) {
    setGroups((prev) => prev.map((g, i) => (i === index ? { ...g, ...patch } : g)));
  }

  function updateCard(
    groupIdx: number,
    type: "verification" | "reading",
    cardIdx: number,
    patch: Partial<CardInput>
  ) {
    setManualCards((prev) =>
      prev.map((grp, gi) =>
        gi === groupIdx
          ? { ...grp, [type]: grp[type].map((c, ci) => (ci === cardIdx ? { ...c, ...patch } : c)) }
          : grp
      )
    );
  }

  async function generateGroup(index: number) {
    const group = GROUPS[index];
    updateGroup(index, { status: "loading", content: "" });

    let verificationCards: { nameZh: string; name: string; isReversed: boolean }[];
    let readingCards: { nameZh: string; name: string; isReversed: boolean }[];

    if (inputMode === "manual") {
      verificationCards = manualCards[index].verification.map((c) => ({ nameZh: c.name, name: c.name, isReversed: c.isReversed }));
      readingCards      = manualCards[index].reading.map((c)      => ({ nameZh: c.name, name: c.name, isReversed: c.isReversed }));
    } else {
      const pool = drawCards(8).map((c) => ({ ...c, isReversed: Math.random() > 0.5 }));
      verificationCards = pool.slice(0, 3);
      readingCards      = pool.slice(3);
    }

    const res = await fetch("/api/divination", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "mass",
        theme,
        question,
        groupNumber: group.number,
        groupSymbol: group.symbol,
        verificationCards,
        readingCards,
        messages: [],
      }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      updateGroup(index, {
        status: "error",
        retryAfter: res.status === 429 ? (data.retryAfter ?? 60) : undefined,
      });
      return;
    }

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
      metadata: { massTheme: theme, group: group.number, question, verificationCards, readingCards },
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

            {/* Input Mode */}
            <div className="flex flex-col gap-3">
              <p className="text-slate-400 text-sm">抽牌方式</p>
              <div className="flex rounded-xl border border-slate-800 overflow-hidden">
                <button
                  onClick={() => setInputMode("auto")}
                  className={`flex-1 py-2.5 text-sm font-medium transition-all cursor-pointer border-r border-slate-800 ${
                    inputMode === "auto" ? "bg-pink-900/30 text-pink-200" : "text-slate-500 hover:text-slate-400"
                  }`}
                >
                  🎴 随机抽牌
                </button>
                <button
                  onClick={() => setInputMode("manual")}
                  className={`flex-1 py-2.5 text-sm font-medium transition-all cursor-pointer ${
                    inputMode === "manual" ? "bg-pink-900/30 text-pink-200" : "text-slate-500 hover:text-slate-400"
                  }`}
                >
                  ✍️ 手动输入牌
                </button>
              </div>
              {inputMode === "manual" && (
                <p className="text-slate-600 text-xs">每组需输入 3 张验证牌 + 5 张解读牌，共 8 张</p>
              )}
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

        {/* Reading */}
        {step === "reading" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full flex flex-col gap-5">

            {/* Header info */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 flex-wrap">
                <span>{currentTheme.emoji}</span>
                <span className="text-white text-sm font-medium">{currentTheme.label}</span>
                <span className="text-slate-500 text-xs">·</span>
                <span className="text-pink-300/70 text-xs truncate max-w-[140px]">「{question}」</span>
                {inputMode === "manual" && (
                  <span className="text-slate-600 text-xs">· 手动输牌</span>
                )}
              </div>
              <button onClick={reset} className="text-slate-600 text-xs hover:text-slate-400 cursor-pointer shrink-0">
                重新设置
              </button>
            </div>

            {/* Group panels */}
            {GROUPS.map((group, i) => {
              const g   = groups[i];
              const ac  = ACCENT[group.accent];
              const gc  = manualCards[i];
              const verifyDone = gc.verification.every((c) => c.name.trim() !== "");
              const readDone   = gc.reading.every((c) => c.name.trim() !== "");
              const canGenerate = inputMode === "auto" || (verifyDone && readDone);

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
                        whileHover={canGenerate ? { scale: 1.05 } : {}}
                        whileTap={canGenerate ? { scale: 0.95 } : {}}
                        onClick={() => canGenerate && generateGroup(i)}
                        disabled={!canGenerate}
                        className={`px-4 py-2 rounded-full bg-gradient-to-r ${ac.btn} text-white text-xs font-medium shadow-md transition-opacity ${
                          canGenerate ? "cursor-pointer" : "opacity-30 cursor-not-allowed"
                        }`}
                      >
                        生成第 {group.number} 组
                      </motion.button>
                    )}
                    {g.status === "done" && (
                      <button
                        onClick={() => updateGroup(i, { status: "idle", content: "" })}
                        className="text-slate-600 text-xs hover:text-slate-400 cursor-pointer"
                      >
                        {inputMode === "manual" ? "重新生成" : "重抽"}
                      </button>
                    )}
                    {g.status === "error" && (
                      <span className="text-amber-500/70 text-xs">额度不足</span>
                    )}
                  </div>

                  {/* Manual card inputs */}
                  {inputMode === "manual" && g.status === "idle" && (
                    <div className="px-5 pb-5 border-t border-white/5 pt-4 flex flex-col gap-5">

                      {/* Verification cards */}
                      <div className="flex flex-col gap-2">
                        <p className={`text-xs font-medium ${ac.sub}`}>验证牌（3张）· 星座 / 当下状态 / 特定讯息</p>
                        {gc.verification.map((card, ci) => (
                          <div key={ci} className="flex items-center gap-2">
                            <span className="text-slate-600 text-xs w-8 shrink-0">验{ci + 1}</span>
                            <input
                              list={`datalist-${i}`}
                              value={card.name}
                              onChange={(e) => updateCard(i, "verification", ci, { name: e.target.value })}
                              placeholder="牌名，如：星星、权杖三..."
                              className="flex-1 rounded-lg bg-slate-900/80 border border-slate-700/40 text-white text-xs px-3 py-2 outline-none focus:border-slate-500 placeholder:text-slate-700 min-w-0"
                            />
                            <button
                              onClick={() => updateCard(i, "verification", ci, { isReversed: !card.isReversed })}
                              className={`text-xs px-2.5 py-2 rounded-lg border transition-all cursor-pointer shrink-0 ${
                                card.isReversed
                                  ? "border-orange-500/40 bg-orange-900/20 text-orange-300"
                                  : "border-slate-700/50 text-slate-500 hover:border-slate-600"
                              }`}
                            >
                              {card.isReversed ? "逆位" : "正位"}
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Reading cards */}
                      <div className="flex flex-col gap-2">
                        <p className={`text-xs font-medium ${ac.sub}`}>解读牌（5张）· 解析本期主题</p>
                        {gc.reading.map((card, ci) => (
                          <div key={ci} className="flex items-center gap-2">
                            <span className="text-slate-600 text-xs w-8 shrink-0">读{ci + 1}</span>
                            <input
                              list={`datalist-${i}`}
                              value={card.name}
                              onChange={(e) => updateCard(i, "reading", ci, { name: e.target.value })}
                              placeholder="牌名，如：月亮、圣杯Ace..."
                              className="flex-1 rounded-lg bg-slate-900/80 border border-slate-700/40 text-white text-xs px-3 py-2 outline-none focus:border-slate-500 placeholder:text-slate-700 min-w-0"
                            />
                            <button
                              onClick={() => updateCard(i, "reading", ci, { isReversed: !card.isReversed })}
                              className={`text-xs px-2.5 py-2 rounded-lg border transition-all cursor-pointer shrink-0 ${
                                card.isReversed
                                  ? "border-orange-500/40 bg-orange-900/20 text-orange-300"
                                  : "border-slate-700/50 text-slate-500 hover:border-slate-600"
                              }`}
                            >
                              {card.isReversed ? "逆位" : "正位"}
                            </button>
                          </div>
                        ))}
                      </div>

                      <datalist id={`datalist-${i}`}>
                        {ALL_CARDS.map((c) => (
                          <option key={c.id} value={c.nameZh} />
                        ))}
                      </datalist>

                      {!(verifyDone && readDone) && (
                        <p className="text-slate-700 text-xs -mt-2">
                          {!verifyDone ? "请填写验证牌" : "请填写解读牌"}（共 8 张后可生成）
                        </p>
                      )}
                    </div>
                  )}

                  {/* Error state */}
                  {g.status === "error" && (
                    <div className="px-5 pb-5 border-t border-white/5 pt-4 flex flex-col gap-2">
                      {g.retryAfter ? (
                        <>
                          <p className="text-amber-400/90 text-sm font-medium">请求频率超限，请稍等</p>
                          <p className="text-slate-500 text-xs leading-relaxed">
                            Gemini 免费版有每分钟请求限制。请等约 {g.retryAfter} 秒后重试，或前往
                            <span className="text-slate-400"> Google AI Studio → 开启计费</span>
                            以提升配额。
                          </p>
                        </>
                      ) : (
                        <p className="text-red-400/80 text-sm">生成失败，请稍后重试</p>
                      )}
                      <button
                        onClick={() => updateGroup(i, { status: "idle", retryAfter: undefined })}
                        className="text-slate-500 text-xs hover:text-slate-300 cursor-pointer mt-1 text-left"
                      >
                        返回重试 →
                      </button>
                    </div>
                  )}

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
                        <div className="prose prose-invert prose-sm max-w-none text-slate-300 leading-relaxed" style={{ fontSize: "0.875rem" }}>
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
                              hr: () => <div className="my-4 border-t border-white/8" />,
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
