"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  throwCoins,
  getHexagramNumber,
  getHexagram,
  isYang,
  isChanging,
  HexagramLines,
  LineValue,
} from "@/lib/divination/iching-hexagrams";

interface CoinThrowProps {
  onComplete: (hexagramName: string, hexagramNumber: number) => void;
}

const LINE_LABELS = ["初爻", "二爻", "三爻", "四爻", "五爻", "上爻"];

export function CoinThrow({ onComplete }: CoinThrowProps) {
  const [lines, setLines] = useState<LineValue[]>([]);
  const [isAnimating, setIsAnimating] = useState(false);
  const [coinFaces, setCoinFaces] = useState<("H" | "T")[]>([]);
  const [done, setDone] = useState(false);

  async function throwNextLine() {
    if (lines.length >= 6 || isAnimating) return;
    setIsAnimating(true);

    // Animate coins spinning
    const spins = 8;
    for (let i = 0; i < spins; i++) {
      setCoinFaces([
        Math.random() > 0.5 ? "H" : "T",
        Math.random() > 0.5 ? "H" : "T",
        Math.random() > 0.5 ? "H" : "T",
      ]);
      await new Promise((r) => setTimeout(r, 80));
    }

    const value = throwCoins();
    // Map value to coin faces: 9=HHH, 8=HHT/HTH/THH, 7=TTH/THT/HTT, 6=TTT
    const finalFaces: ("H" | "T")[] = value === 9
      ? ["H", "H", "H"]
      : value === 8
      ? ["H", "H", "T"]
      : value === 7
      ? ["T", "T", "H"]
      : ["T", "T", "T"];
    setCoinFaces(finalFaces);

    const newLines = [...lines, value] as LineValue[];
    setLines(newLines);
    setIsAnimating(false);

    if (newLines.length === 6) {
      setDone(true);
      const num = getHexagramNumber(newLines as HexagramLines);
      const hex = getHexagram(num);
      setTimeout(() => onComplete(hex.nameZh, hex.number), 800);
    }
  }

  const hexNumber = done ? getHexagramNumber(lines as HexagramLines) : null;
  const hexagram = hexNumber ? getHexagram(hexNumber) : null;

  return (
    <div className="flex flex-col items-center gap-8 w-full max-w-sm mx-auto">
      {/* Coins */}
      <div className="flex gap-4">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={isAnimating ? { rotateY: [0, 180, 360], scale: [1, 1.1, 1] } : {}}
            transition={{ duration: 0.08, repeat: isAnimating ? Infinity : 0 }}
            className={`w-14 h-14 rounded-full border-2 flex items-center justify-center text-lg font-bold shadow-lg
              ${coinFaces[i] === "H"
                ? "bg-amber-500/20 border-amber-400 text-amber-300"
                : coinFaces[i] === "T"
                ? "bg-slate-700/50 border-slate-500 text-slate-400"
                : "bg-slate-800/50 border-slate-700 text-slate-600"
              }`}
          >
            {coinFaces[i] === "H" ? "正" : coinFaces[i] === "T" ? "反" : "○"}
          </motion.div>
        ))}
      </div>

      {/* Lines (shown top to bottom visually, but built bottom to top) */}
      <div className="flex flex-col gap-2 w-full">
        {Array.from({ length: 6 }).map((_, visualIdx) => {
          const lineIdx = 5 - visualIdx; // top = line 5 (upper), bottom = line 0
          const value = lines[lineIdx];
          const label = LINE_LABELS[lineIdx];
          const yang = value !== undefined ? isYang(value) : null;
          const changing = value !== undefined ? isChanging(value) : false;

          return (
            <AnimatePresence key={lineIdx}>
              {value !== undefined ? (
                <motion.div
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3"
                >
                  <span className="text-slate-500 text-xs w-6 text-right">{label}</span>
                  <div className="flex gap-1 flex-1 items-center">
                    {yang ? (
                      <div className="h-3 flex-1 bg-gradient-to-r from-amber-400 to-amber-500 rounded-sm" />
                    ) : (
                      <div className="h-3 flex-1 flex gap-2">
                        <div className="flex-1 bg-slate-600 rounded-sm" />
                        <div className="w-3" />
                        <div className="flex-1 bg-slate-600 rounded-sm" />
                      </div>
                    )}
                  </div>
                  {changing && (
                    <span className="text-amber-400 text-xs">变</span>
                  )}
                </motion.div>
              ) : (
                <div className="flex items-center gap-3">
                  <span className="text-slate-700 text-xs w-6 text-right">{label}</span>
                  <div className="h-3 flex-1 border border-dashed border-slate-800 rounded-sm" />
                </div>
              )}
            </AnimatePresence>
          );
        })}
      </div>

      {/* Hexagram name */}
      {hexagram && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <p className="text-4xl text-amber-300">{hexagram.symbol}</p>
          <p className="text-white text-xl mt-1">第 {hexagram.number} 卦 · {hexagram.nameZh}卦</p>
          <p className="text-slate-400 text-sm mt-1">{hexagram.keywords.join("  ")}</p>
        </motion.div>
      )}

      {/* Throw button */}
      {!done && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={throwNextLine}
          disabled={isAnimating}
          className="px-8 py-4 rounded-full bg-gradient-to-r from-amber-600 to-orange-600 text-white font-medium shadow-lg shadow-amber-500/20 disabled:opacity-50 cursor-pointer"
        >
          {lines.length === 0
            ? "摇第一爻"
            : lines.length < 6
            ? `摇第 ${lines.length + 1} 爻`
            : "起卦完成"}
        </motion.button>
      )}

      <p className="text-slate-600 text-xs text-center">
        {lines.length < 6
          ? `已摇 ${lines.length} / 6 爻，从初爻起，依次向上`
          : "六爻已满，正在解卦..."}
      </p>
    </div>
  );
}
