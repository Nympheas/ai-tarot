"use client";

import { useState, useRef, useEffect } from "react";
import { ALL_CARDS, TarotCard } from "@/lib/divination/tarot-cards";

export type SelectedCard = TarotCard & { isReversed: boolean; position: string };

interface SlotProps {
  position: string;
  positionIndex: number;
  card: SelectedCard | null;
  usedIds: Set<number>;
  onChange: (card: SelectedCard | null) => void;
}

function CardSlot({ position, positionIndex, card, usedIds, onChange }: SlotProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  const filtered = ALL_CARDS.filter(
    (c) =>
      !usedIds.has(c.id) &&
      (c.nameZh.includes(query) || c.name.toLowerCase().includes(query.toLowerCase()))
  );

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function select(c: TarotCard) {
    onChange({ ...c, isReversed: false, position });
    setOpen(false);
    setQuery("");
  }

  function clear() {
    onChange(null);
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <span className="text-slate-500 text-xs tracking-wider">{position}</span>

      <div ref={ref} className="relative w-full">
        {card ? (
          <div className="bg-slate-900/80 border border-purple-500/30 rounded-2xl p-4 flex flex-col gap-2">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-white text-sm font-medium">{card.nameZh}</p>
                <p className="text-slate-500 text-xs">{card.name}</p>
              </div>
              <button
                onClick={clear}
                className="text-slate-600 hover:text-slate-400 text-lg leading-none mt-0.5"
                aria-label="清除"
              >
                ×
              </button>
            </div>
            <button
              onClick={() => onChange({ ...card, isReversed: !card.isReversed })}
              className={`text-xs px-3 py-1 rounded-full border transition-colors w-fit ${
                card.isReversed
                  ? "border-amber-500/50 text-amber-400 bg-amber-900/20"
                  : "border-purple-500/40 text-purple-300 bg-purple-900/20"
              }`}
            >
              {card.isReversed ? "逆位" : "正位"}
            </button>
          </div>
        ) : (
          <button
            onClick={() => setOpen(true)}
            className="w-full h-24 rounded-2xl border border-dashed border-purple-500/20 text-slate-600 text-sm hover:border-purple-500/50 hover:text-slate-400 transition-colors flex flex-col items-center justify-center gap-1"
          >
            <span className="text-2xl">+</span>
            <span>选择牌</span>
          </button>
        )}

        {open && (
          <div className="absolute left-0 right-0 top-full mt-2 z-50 bg-[#111827] border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-3 border-b border-white/10">
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="搜索牌名…"
                className="w-full bg-white/10 rounded-xl px-3 py-2 text-sm text-white placeholder:text-slate-600 outline-none"
              />
            </div>
            <div className="max-h-60 overflow-y-auto">
              {filtered.length === 0 ? (
                <p className="text-slate-500 text-sm text-center py-4">没有找到</p>
              ) : (
                filtered.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => select(c)}
                    className="w-full text-left px-4 py-2.5 hover:bg-white/5 transition-colors"
                  >
                    <span className="text-white text-sm">{c.nameZh}</span>
                    <span className="text-slate-500 text-xs ml-2">{c.name}</span>
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface Props {
  onConfirm: (cards: SelectedCard[]) => void;
}

const SPREADS = {
  3: ["过去", "现在", "未来"],
  5: ["现状", "挑战", "潜在", "建议", "结果"],
} as const;

type SpreadSize = 3 | 5;

export function CardPicker({ onConfirm }: Props) {
  const [size, setSize] = useState<SpreadSize>(3);
  const [slots, setSlots] = useState<(SelectedCard | null)[]>([null, null, null]);

  function changeSize(n: SpreadSize) {
    setSize(n);
    setSlots(Array(n).fill(null));
  }

  function updateSlot(i: number, card: SelectedCard | null) {
    setSlots((prev) => prev.map((s, idx) => (idx === i ? card : s)));
  }

  const usedIds = new Set(slots.filter(Boolean).map((c) => c!.id));
  const allFilled = slots.every(Boolean);
  const positions = SPREADS[size];

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Spread size toggle */}
      <div className="flex gap-3 justify-center">
        {([3, 5] as SpreadSize[]).map((n) => (
          <button
            key={n}
            onClick={() => changeSize(n)}
            className={`px-5 py-2 rounded-full text-sm transition-colors ${
              size === n
                ? "bg-purple-600 text-white"
                : "border border-purple-500/30 text-slate-400 hover:border-purple-400"
            }`}
          >
            {n} 张牌阵
          </button>
        ))}
      </div>

      {/* Card slots */}
      <div className={`grid gap-4 ${size === 5 ? "grid-cols-1 sm:grid-cols-5" : "grid-cols-1 sm:grid-cols-3"}`}>
        {positions.map((pos, i) => (
          <CardSlot
            key={`${size}-${i}`}
            position={pos}
            positionIndex={i}
            card={slots[i]}
            usedIds={new Set([...usedIds].filter((id) => id !== slots[i]?.id))}
            onChange={(card) => updateSlot(i, card)}
          />
        ))}
      </div>

      <button
        disabled={!allFilled}
        onClick={() => onConfirm(slots as SelectedCard[])}
        className="w-full py-4 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium disabled:opacity-30 transition-opacity shadow-lg shadow-purple-500/20"
      >
        {allFilled ? "开始解读" : `还需选择 ${slots.filter((s) => !s).length} 张牌`}
      </button>
    </div>
  );
}
