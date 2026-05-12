"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#0a0a1a] text-white flex flex-col items-center justify-center px-4">
      {/* Background stars */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 60 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-px h-px bg-white rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{ opacity: [0.1, 0.8, 0.1] }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 4,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center gap-10 max-w-lg text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <p className="text-purple-400 text-sm tracking-[0.3em] uppercase mb-4">灵镜 AI</p>
          <h1 className="text-5xl font-light tracking-wide text-white leading-tight">
            探索内心
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
              看见可能
            </span>
          </h1>
          <p className="text-slate-400 mt-6 leading-relaxed">
            结合传统塔罗与易经智慧，以 AI 为媒介，
            <br />
            开启一场深入内心的对话
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col gap-4 w-full"
        >
          <Link
            href="/tarot"
            className="w-full py-4 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium text-center shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-shadow"
          >
            🔮 塔罗解读
          </Link>
          <Link
            href="/iching"
            className="w-full py-4 rounded-full border border-purple-500/40 text-purple-300 text-center hover:border-purple-400 hover:text-purple-200 transition-colors"
          >
            ☯ 易经起卦
          </Link>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-slate-600 text-xs"
        >
          仅供娱乐与自我探索，不构成任何专业建议
        </motion.p>
      </div>
    </main>
  );
}
