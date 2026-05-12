"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TarotCard, drawCards } from "@/lib/divination/tarot-cards";

type DrawnCard = TarotCard & { isReversed: boolean; position: string };

const POSITIONS = ["过去", "现在", "未来"];

interface CardDrawProps {
  onCardsDrawn: (cards: DrawnCard[]) => void;
}

export function CardDraw({ onCardsDrawn }: CardDrawProps) {
  const [drawn, setDrawn] = useState<DrawnCard[]>([]);
  const [isShuffling, setIsShuffling] = useState(false);
  const [revealed, setRevealed] = useState<boolean[]>([false, false, false]);

  function handleDraw() {
    setIsShuffling(true);
    setTimeout(() => {
      const cards = drawCards(3).map((card, i) => ({
        ...card,
        isReversed: Math.random() > 0.5,
        position: POSITIONS[i],
      }));
      setDrawn(cards);
      setRevealed([false, false, false]);
      setIsShuffling(false);
      // reveal cards one by one
      [0, 1, 2].forEach((i) => {
        setTimeout(() => {
          setRevealed((prev) => {
            const next = [...prev];
            next[i] = true;
            if (i === 2) onCardsDrawn(cards);
            return next;
          });
        }, i * 600 + 300);
      });
    }, 1000);
  }

  return (
    <div className="flex flex-col items-center gap-8">
      {drawn.length === 0 && (
        <motion.button
          onClick={handleDraw}
          disabled={isShuffling}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-lg font-medium shadow-lg shadow-purple-500/30 disabled:opacity-50 cursor-pointer"
        >
          {isShuffling ? "洗牌中..." : "抽取三张牌"}
        </motion.button>
      )}

      {isShuffling && (
        <div className="flex gap-3">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ rotateY: [0, 180, 360], y: [0, -10, 0] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.1 }}
              className="w-16 h-24 rounded-lg bg-gradient-to-br from-purple-800 to-indigo-900 border border-purple-500/40"
            />
          ))}
        </div>
      )}

      {drawn.length > 0 && (
        <div className="flex gap-6 flex-wrap justify-center">
          {drawn.map((card, i) => (
            <div key={card.id} className="flex flex-col items-center gap-2">
              <p className="text-purple-300 text-sm">{card.position}</p>
              <AnimatePresence>
                {revealed[i] ? (
                  <motion.div
                    initial={{ rotateY: 90, opacity: 0 }}
                    animate={{ rotateY: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className={`w-28 h-44 rounded-xl border border-purple-400/30 bg-gradient-to-br from-slate-800 to-slate-900 flex flex-col items-center justify-center gap-2 p-3 shadow-lg ${card.isReversed ? "rotate-180" : ""}`}
                  >
                    <span className="text-3xl">🔮</span>
                    <p className="text-white text-sm font-medium text-center">{card.nameZh}</p>
                    <p className="text-purple-300 text-xs text-center">{card.name}</p>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="w-28 h-44 rounded-xl bg-gradient-to-br from-purple-900 to-indigo-950 border border-purple-500/30"
                  />
                )}
              </AnimatePresence>
              {revealed[i] && (
                <p className="text-xs text-slate-400">{card.isReversed ? "逆位" : "正位"}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {drawn.length > 0 && revealed[2] && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={() => { setDrawn([]); setRevealed([false, false, false]); }}
          className="text-purple-400 text-sm underline underline-offset-2 cursor-pointer"
        >
          重新抽牌
        </motion.button>
      )}
    </div>
  );
}
