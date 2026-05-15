"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const [credits, setCredits] = useState<number | null>(null);

  useEffect(() => {
    const poll = async () => {
      for (let i = 0; i < 8; i++) {
        await new Promise((r) => setTimeout(r, 1500));
        const res = await fetch("/api/credits");
        if (res.ok) {
          const data = await res.json();
          if (data.credits > 0) {
            setCredits(data.credits);
            return;
          }
        }
      }
      setCredits(0);
    };
    poll();
  }, []);

  return (
    <main className="min-h-screen bg-[#06060f] flex items-center justify-center p-6">
      <motion.div
        className="max-w-sm w-full text-center flex flex-col gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-5xl">✨</div>
        <div>
          <h1 className="text-white text-2xl font-semibold">支付成功</h1>
          {credits === null ? (
            <p className="text-slate-400 mt-2 text-sm">正在确认积分…</p>
          ) : (
            <p className="text-slate-400 mt-2 text-sm">
              你现在有 <span className="text-violet-300 font-medium">{credits} 次</span> 占卜次数
            </p>
          )}
        </div>
        <button
          onClick={() => router.push("/tarot")}
          className="w-full rounded-2xl bg-violet-600 hover:bg-violet-500 text-white font-medium py-3.5 transition-colors cursor-pointer"
        >
          开始占卜
        </button>
      </motion.div>
    </main>
  );
}
