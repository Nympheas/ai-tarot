"use client";

import { motion } from "framer-motion";

export const GROUPS = [
  { number: 1, symbol: "🔮", name: "紫水晶", color: "from-purple-600/20 to-purple-900/20", border: "border-purple-500/40", glow: "shadow-purple-500/20" },
  { number: 2, symbol: "🌙", name: "月光石", color: "from-blue-600/20 to-slate-900/20", border: "border-blue-400/40", glow: "shadow-blue-400/20" },
  { number: 3, symbol: "✨", name: "黄水晶", color: "from-amber-600/20 to-yellow-900/20", border: "border-amber-400/40", glow: "shadow-amber-400/20" },
];

interface GroupSelectProps {
  onSelect: (group: typeof GROUPS[number]) => void;
}

export function GroupSelect({ onSelect }: GroupSelectProps) {
  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <p className="text-slate-400 text-sm text-center">
        静下心来，感受一下哪组在呼唤你
      </p>
      <div className="flex gap-4 w-full justify-center flex-wrap">
        {GROUPS.map((group, i) => (
          <motion.button
            key={group.number}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15 }}
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onSelect(group)}
            className={`flex flex-col items-center gap-3 w-28 py-6 rounded-2xl border bg-gradient-to-b ${group.color} ${group.border} shadow-lg ${group.glow} cursor-pointer transition-shadow hover:shadow-xl`}
          >
            <motion.span
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}
              className="text-4xl"
            >
              {group.symbol}
            </motion.span>
            <span className="text-white/80 text-sm">第 {group.number} 组</span>
            <span className="text-white/40 text-xs">{group.name}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
