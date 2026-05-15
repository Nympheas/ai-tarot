"use client";

import { useEffect, useState } from "react";

type Props = {
  retryAfter: number; // seconds
  onRetry: () => void;
  onDismiss: () => void;
};

export function RetryCountdown({ retryAfter, onRetry, onDismiss }: Props) {
  const [seconds, setSeconds] = useState(retryAfter);

  useEffect(() => {
    if (seconds <= 0) {
      onRetry();
      return;
    }
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [seconds]);

  return (
    <div className="w-full rounded-2xl border border-amber-500/20 bg-amber-900/10 px-6 py-5 flex flex-col gap-3">
      <p className="text-amber-400/90 font-medium">请求太频繁，稍等一下</p>
      <p className="text-slate-400 text-sm leading-relaxed">
        {seconds > 0
          ? `${seconds} 秒后自动重试…`
          : "正在重试…"}
      </p>
      <button
        onClick={onDismiss}
        className="text-slate-500 text-xs hover:text-slate-300 cursor-pointer text-left"
      >
        取消，返回重新占卜 →
      </button>
    </div>
  );
}
