"use client";

import { motion } from "framer-motion";

const PHRASES = [
  "正在感应牌阵能量...",
  "解读符号与象征...",
  "聆听宇宙的回应...",
  "将智慧化为文字...",
];

export function ReadingLoader() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center gap-6 py-12"
    >
      {/* Orbiting dots */}
      <div className="relative w-16 h-16">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute w-2.5 h-2.5 rounded-full bg-purple-400"
            animate={{
              rotate: [i * 120, i * 120 + 360],
            }}
            transition={{
              duration: 2.4,
              repeat: Infinity,
              ease: "linear",
              delay: 0,
            }}
            style={{
              top: "50%",
              left: "50%",
              transformOrigin: "-20px 0px",
              marginTop: "-5px",
              marginLeft: "-5px",
              opacity: 0.4 + i * 0.2,
            }}
          />
        ))}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-3 h-3 rounded-full bg-purple-300"
          />
        </div>
      </div>

      {/* Cycling phrases */}
      <motion.div className="h-5 overflow-hidden">
        {PHRASES.map((phrase, i) => (
          <motion.p
            key={phrase}
            className="text-slate-500 text-sm text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{
              opacity: [0, 1, 1, 0],
              y: [10, 0, 0, -10],
            }}
            transition={{
              duration: 2.4,
              delay: i * 2.4,
              repeat: Infinity,
              repeatDelay: PHRASES.length * 2.4 - 2.4,
            }}
          >
            {phrase}
          </motion.p>
        ))}
      </motion.div>
    </motion.div>
  );
}
