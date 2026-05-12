"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { loadReadings, deleteReading, SavedReading } from "@/lib/storage";

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("zh-CN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

export default function HistoryPage() {
  const [readings, setReadings] = useState<SavedReading[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    setReadings(loadReadings());
  }, []);

  function handleDelete(id: string) {
    deleteReading(id);
    setReadings((prev) => prev.filter((r) => r.id !== id));
    if (expanded === id) setExpanded(null);
  }

  return (
    <main className="min-h-screen bg-[#0a0a12] text-white px-4 py-12 pb-28">
      <div className="max-w-2xl mx-auto flex flex-col gap-6">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <h1 className="text-3xl font-light tracking-widest text-slate-200">占卜记录</h1>
          <p className="text-slate-500 mt-2 text-sm">共 {readings.length} 次</p>
        </motion.div>

        {readings.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20 text-slate-600">
            <p className="text-4xl mb-4">🌙</p>
            <p>还没有占卜记录</p>
            <p className="text-sm mt-1">完成一次占卜后会自动保存在这里</p>
          </motion.div>
        )}

        <div className="flex flex-col gap-3">
          {readings.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="rounded-2xl border border-white/8 bg-slate-900/50 overflow-hidden"
            >
              {/* Card header */}
              <button
                onClick={() => setExpanded(expanded === r.id ? null : r.id)}
                className="w-full flex items-center gap-4 px-5 py-4 text-left hover:bg-white/5 transition-colors"
              >
                <span className="text-2xl flex-shrink-0">
                  {r.type === "tarot" ? "🔮" : "☯"}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm truncate">{r.question}</p>
                  <p className="text-slate-500 text-xs mt-0.5">
                    {r.type === "tarot" ? "塔罗" : "易经"} · {formatDate(r.createdAt)}
                  </p>
                </div>
                <span className="text-slate-600 text-xs flex-shrink-0">
                  {expanded === r.id ? "收起 ▲" : "展开 ▼"}
                </span>
              </button>

              {/* Expanded content */}
              <AnimatePresence>
                {expanded === r.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 border-t border-white/8 pt-4">
                      {/* Metadata badges */}
                      {r.type === "tarot" && Array.isArray((r.metadata as { cards?: unknown[] }).cards) && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {((r.metadata as { cards: Array<{ nameZh: string; position: string; isReversed: boolean }> }).cards).map((c, ci) => (
                            <span key={ci} className="text-xs px-2 py-1 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/20">
                              {c.position} · {c.nameZh} {c.isReversed ? "逆" : "正"}
                            </span>
                          ))}
                        </div>
                      )}
                      {r.type === "iching" && (r.metadata as { hexagramName?: string; hexagramNumber?: number }).hexagramName && (
                        <div className="mb-4">
                          <span className="text-xs px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/20">
                            第 {(r.metadata as { hexagramNumber: number }).hexagramNumber} 卦 · {(r.metadata as { hexagramName: string }).hexagramName}卦
                          </span>
                        </div>
                      )}

                      {/* Reading content */}
                      <div className="prose prose-invert prose-sm max-w-none text-slate-300 leading-relaxed">
                        <ReactMarkdown>{r.result}</ReactMarkdown>
                      </div>

                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(r.id)}
                        className="mt-4 text-xs text-slate-600 hover:text-red-400 transition-colors cursor-pointer"
                      >
                        删除此记录
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
