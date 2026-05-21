"use client";

import { useState } from "react";
import { ALL_CARDS, TarotCard } from "@/lib/divination/tarot-cards";

export type SelectedCard = TarotCard & { isReversed: boolean; position: string };

const SPREADS = {
  3: ["过去", "现在", "未来"],
  5: ["现状", "挑战", "潜在", "建议", "结果"],
} as const;

type SpreadSize = 3 | 5;

// ── Full-screen card selection modal ──────────────────────────────────────────
interface PickerModalProps {
  position: string;
  usedIds: Set<number>;
  onSelect: (card: TarotCard) => void;
  onClose: () => void;
}

function PickerModal({ position, usedIds, onSelect, onClose }: PickerModalProps) {
  const [query, setQuery] = useState("");

  const filtered = ALL_CARDS.filter(
    (c) =>
      !usedIds.has(c.id) &&
      (c.nameZh.includes(query) || c.name.toLowerCase().includes(query.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#0a0a1a]">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-4 border-b border-white/10">
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-white text-2xl leading-none"
        >
          ←
        </button>
        <span className="text-white font-medium">选择「{position}」的牌</span>
      </div>

      {/* Search */}
      <div className="px-4 py-3 border-b border-white/10">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="搜索牌名（中文或英文）…"
          className="w-full bg-white/10 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 outline-none text-sm"
        />
      </div>

      {/* Card list */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <p className="text-slate-500 text-center py-12">没有找到匹配的牌</p>
        ) : (
          filtered.map((c) => (
            <button
              key={c.id}
              onClick={() => { onSelect(c); onClose(); }}
              className="w-full text-left px-5 py-4 border-b border-white/5 hover:bg-white/5 active:bg-white/10 transition-colors flex items-center justify-between"
            >
              <div>
                <span className="text-white text-sm font-medium">{c.nameZh}</span>
                <span className="text-slate-500 text-xs ml-2">{c.name}</span>
              </div>
              <span className="text-slate-600 text-xs">{c.arcana === "major" ? "大阿尔卡纳" : c.suit}</span>
            </button>
          ))
        )}
      </div>
    </div>
  );
}

// ── Single card slot ──────────────────────────────────────────────────────────
interface SlotProps {
  position: string;
  card: SelectedCard | null;
  usedIds: Set<number>;
  onPick: () => void;
  onClear: () => void;
  onToggleReversed: () => void;
}

function CardSlot({ position, card, onPick, onClear, onToggleReversed }: SlotProps) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-slate-500 text-xs tracking-wider text-center">{position}</span>

      {card ? (
        <div className="bg-slate-900/80 border border-purple-500/30 rounded-2xl p-4 flex flex-col gap-3">
          {/* Card name + clear */}
          <div className="flex items-start justify-between">
            <div>
              <p className="text-white text-sm font-medium">{card.nameZh}</p>
              <p className="text-slate-500 text-xs mt-0.5">{card.name}</p>
            </div>
            <button
              type="button"
              onClick={onClear}
              className="text-slate-600 hover:text-red-400 transition-colors text-xl leading-none pl-2"
            >
              ×
            </button>
          </div>

          {/* Upright / Reversed toggle */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onToggleReversed}
              className={`flex-1 py-2 rounded-xl text-xs font-medium border transition-all ${
                !card.isReversed
                  ? "bg-purple-600 border-purple-500 text-white"
                  : "border-white/10 text-slate-500 hover:border-white/20"
              }`}
            >
              正位
            </button>
            <button
              type="button"
              onClick={onToggleReversed}
              className={`flex-1 py-2 rounded-xl text-xs font-medium border transition-all ${
                card.isReversed
                  ? "bg-amber-600 border-amber-500 text-white"
                  : "border-white/10 text-slate-500 hover:border-white/20"
              }`}
            >
              逆位
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={onPick}
          className="w-full h-28 rounded-2xl border-2 border-dashed border-purple-500/20 text-slate-600 hover:border-purple-500/50 hover:text-slate-400 transition-colors flex flex-col items-center justify-center gap-1"
        >
          <span className="text-3xl">+</span>
          <span className="text-xs">点击选牌</span>
        </button>
      )}
    </div>
  );
}

// ── Main CardPicker ───────────────────────────────────────────────────────────
interface Props {
  onConfirm: (cards: SelectedCard[]) => void;
}

export function CardPicker({ onConfirm }: Props) {
  const [size, setSize] = useState<SpreadSize>(3);
  const [slots, setSlots] = useState<(SelectedCard | null)[]>([null, null, null]);
  const [openSlot, setOpenSlot] = useState<number | null>(null);

  function changeSize(n: SpreadSize) {
    setSize(n);
    setSlots(Array(n).fill(null));
  }

  function pickCard(slotIndex: number, card: TarotCard) {
    const position = SPREADS[size][slotIndex];
    setSlots((prev) =>
      prev.map((s, i) => (i === slotIndex ? { ...card, isReversed: false, position } : s))
    );
  }

  function clearSlot(slotIndex: number) {
    setSlots((prev) => prev.map((s, i) => (i === slotIndex ? null : s)));
  }

  function toggleReversed(slotIndex: number) {
    setSlots((prev) =>
      prev.map((s, i) => (i === slotIndex && s ? { ...s, isReversed: !s.isReversed } : s))
    );
  }

  const usedIds = new Set(slots.filter(Boolean).map((c) => c!.id));
  const allFilled = slots.every(Boolean);
  const positions = SPREADS[size];

  return (
    <>
      {/* Card selection modal */}
      {openSlot !== null && (
        <PickerModal
          position={positions[openSlot]}
          usedIds={new Set([...usedIds].filter((id) => id !== slots[openSlot!]?.id))}
          onSelect={(card) => pickCard(openSlot!, card)}
          onClose={() => setOpenSlot(null)}
        />
      )}

      <div className="w-full flex flex-col gap-6">
        {/* Spread size selector */}
        <div className="flex gap-3 justify-center">
          {([3, 5] as SpreadSize[]).map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => changeSize(n)}
              className={`px-5 py-2 rounded-full text-sm transition-colors ${
                size === n
                  ? "bg-purple-600 text-white"
                  : "border border-purple-500/30 text-slate-400 hover:border-purple-400 hover:text-white"
              }`}
            >
              {n} 张牌阵
            </button>
          ))}
        </div>

        {/* Slots */}
        <div className={`grid gap-4 ${size === 5 ? "grid-cols-1 sm:grid-cols-5" : "grid-cols-3"}`}>
          {positions.map((pos, i) => (
            <CardSlot
              key={`${size}-${i}`}
              position={pos}
              card={slots[i]}
              usedIds={usedIds}
              onPick={() => setOpenSlot(i)}
              onClear={() => clearSlot(i)}
              onToggleReversed={() => toggleReversed(i)}
            />
          ))}
        </div>

        {/* Confirm button */}
        <button
          type="button"
          disabled={!allFilled}
          onClick={() => onConfirm(slots as SelectedCard[])}
          className="w-full py-4 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium disabled:opacity-30 transition-opacity shadow-lg shadow-purple-500/20 cursor-pointer disabled:cursor-not-allowed"
        >
          {allFilled
            ? "开始解读 →"
            : `还需选择 ${slots.filter((s) => !s).length} 张牌`}
        </button>
      </div>
    </>
  );
}
