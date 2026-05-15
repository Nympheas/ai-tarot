"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  open: boolean;
  onClose: () => void;
};

const PACKAGES = [
  { quantity: 1, price: "$1.99", priceNote: "约 ¥14", label: "1 次", popular: false },
  { quantity: 5, price: "$6.99", priceNote: "约 ¥50，省 30%", label: "5 次", popular: true },
];

export function PaywallModal({ open, onClose }: Props) {
  const [selected, setSelected] = useState(5);
  const [loading, setLoading] = useState(false);

  async function handleBuy() {
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: selected }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } finally {
      setLoading(false);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            className="relative w-full max-w-sm rounded-3xl border border-white/10 bg-[#0f0f1a] p-7 flex flex-col gap-6 shadow-2xl"
            initial={{ scale: 0.92, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
          >
            <div className="text-center">
              <div className="text-3xl mb-3">🔮</div>
              <h2 className="text-white font-semibold text-lg">免费次数已用完</h2>
              <p className="text-slate-400 text-sm mt-1">购买后继续探索命运的指引</p>
            </div>

            <div className="flex flex-col gap-3">
              {PACKAGES.map((pkg) => (
                <button
                  key={pkg.quantity}
                  onClick={() => setSelected(pkg.quantity)}
                  className={`relative w-full rounded-2xl border p-4 text-left transition-all cursor-pointer ${
                    selected === pkg.quantity
                      ? "border-violet-500/60 bg-violet-500/10"
                      : "border-white/10 bg-white/5 hover:border-white/20"
                  }`}
                >
                  {pkg.popular && (
                    <span className="absolute -top-2.5 right-4 text-xs bg-violet-500 text-white px-2 py-0.5 rounded-full">
                      推荐
                    </span>
                  )}
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-white font-medium">{pkg.label}</span>
                      <span className="text-slate-400 text-xs ml-2">{pkg.priceNote}</span>
                    </div>
                    <span className="text-violet-300 font-semibold">{pkg.price}</span>
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={handleBuy}
              disabled={loading}
              className="w-full rounded-2xl bg-violet-600 hover:bg-violet-500 disabled:opacity-60 text-white font-medium py-3.5 transition-colors cursor-pointer"
            >
              {loading ? "跳转中…" : "立即购买"}
            </button>

            <button
              onClick={onClose}
              className="text-slate-500 text-sm hover:text-slate-300 transition-colors cursor-pointer text-center"
            >
              暂时不了
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
