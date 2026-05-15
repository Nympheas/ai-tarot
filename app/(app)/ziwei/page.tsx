"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ReadingOutput } from "@/components/tarot/ReadingOutput";
import { ReadingLoader } from "@/components/ReadingLoader";
import { saveReading } from "@/lib/storage";
import {
  ZiweiFocusArea,
  FOCUS_LABELS,
  SHICHEN_LIST,
} from "@/lib/prompts/ziwei";

type Step = "setup" | "reading";
type Message = { role: "user" | "assistant"; content: string };

const FOCUS_AREAS: { key: ZiweiFocusArea; emoji: string }[] = [
  { key: "overall", emoji: "🌌" },
  { key: "career",  emoji: "🚀" },
  { key: "wealth",  emoji: "💰" },
  { key: "love",    emoji: "💕" },
  { key: "health",  emoji: "🌿" },
  { key: "recent",  emoji: "✨" },
];

const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);
const DAYS   = Array.from({ length: 31 }, (_, i) => i + 1);

export default function ZiweiPage() {
  const [step, setStep]         = useState<Step>("setup");
  const [birthYear, setBirthYear]   = useState(1995);
  const [birthMonth, setBirthMonth] = useState(1);
  const [birthDay, setBirthDay]     = useState(1);
  const [shichenIdx, setShichenIdx] = useState(6); // 午时 default
  const [gender, setGender]         = useState<"male" | "female">("female");
  const [focusArea, setFocusArea]   = useState<ZiweiFocusArea>("overall");
  const [output, setOutput]         = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [messages, setMessages]     = useState<Message[]>([]);
  const [quotaError, setQuotaError] = useState<{ retryAfter?: number } | null>(null);

  const shichen = SHICHEN_LIST[shichenIdx];

  async function startReading() {
    setStep("reading");
    setOutput("");
    setIsStreaming(true);
    setQuotaError(null);

    const res = await fetch("/api/divination", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "ziwei",
        birthYear,
        birthMonth,
        birthDay,
        shichen: shichen.key,
        shichenRange: shichen.range,
        gender,
        focusArea,
        messages: [],
      }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setIsStreaming(false);
      setQuotaError({ retryAfter: res.status === 429 ? (data.retryAfter ?? 60) : undefined });
      return;
    }
    if (!res.body) { setIsStreaming(false); return; }

    const reader  = res.body.getReader();
    const decoder = new TextDecoder();
    let full = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value);
      full += chunk;
      setOutput(full);
    }

    setIsStreaming(false);
    const summary = `${birthYear}年${birthMonth}月${birthDay}日 ${shichen.key} ${gender === "male" ? "男" : "女"} · ${FOCUS_LABELS[focusArea]}`;
    setMessages([
      { role: "user",      content: summary },
      { role: "assistant", content: full },
    ]);
    saveReading({ type: "ziwei" as "tarot", question: summary, result: full, metadata: { birthYear, birthMonth, birthDay, shichen: shichen.key, gender, focusArea } });
  }

  async function handleFollowUp(q: string) {
    setIsStreaming(true);
    const newMessages: Message[] = [...messages, { role: "user", content: q }];

    const res = await fetch("/api/divination", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "ziwei",
        birthYear, birthMonth, birthDay,
        shichen: shichen.key, shichenRange: shichen.range,
        gender, focusArea,
        messages: newMessages,
      }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setIsStreaming(false);
      setQuotaError({ retryAfter: res.status === 429 ? (data.retryAfter ?? 60) : undefined });
      return;
    }
    if (!res.body) { setIsStreaming(false); return; }

    const reader  = res.body.getReader();
    const decoder = new TextDecoder();
    let reply = "";
    setOutput((prev) => prev + "\n\n---\n\n**你问：** " + q + "\n\n");

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value);
      reply += chunk;
      setOutput((prev) => prev + chunk);
    }

    setIsStreaming(false);
    setMessages([...newMessages, { role: "assistant", content: reply }]);
  }

  function reset() {
    setStep("setup");
    setOutput("");
    setMessages([]);
    setQuotaError(null);
  }

  return (
    <main className="min-h-screen bg-[#06060f] text-white px-4 py-12 pb-28">
      <div className="max-w-2xl mx-auto flex flex-col items-center gap-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <h1 className="text-3xl font-light tracking-widest text-purple-200">紫微斗数</h1>
          <p className="text-slate-500 mt-2 text-sm">以生辰八字 · 洞见命运格局</p>
        </motion.div>

        {/* Setup */}
        {step === "setup" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full flex flex-col gap-6">

            {/* Birth date */}
            <div className="flex flex-col gap-3">
              <p className="text-slate-400 text-sm">出生日期（公历）</p>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={birthYear}
                  onChange={(e) => setBirthYear(Number(e.target.value))}
                  min={1920} max={2010}
                  className="w-24 rounded-xl bg-slate-900/80 border border-purple-500/20 text-white text-sm px-3 py-2.5 outline-none focus:border-purple-400/50 text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
                />
                <span className="text-slate-500 self-center text-sm">年</span>
                <select
                  value={birthMonth}
                  onChange={(e) => setBirthMonth(Number(e.target.value))}
                  className="flex-1 rounded-xl bg-slate-900/80 border border-purple-500/20 text-white text-sm px-3 py-2.5 outline-none focus:border-purple-400/50 cursor-pointer"
                >
                  {MONTHS.map((m) => <option key={m} value={m}>{m} 月</option>)}
                </select>
                <select
                  value={birthDay}
                  onChange={(e) => setBirthDay(Number(e.target.value))}
                  className="flex-1 rounded-xl bg-slate-900/80 border border-purple-500/20 text-white text-sm px-3 py-2.5 outline-none focus:border-purple-400/50 cursor-pointer"
                >
                  {DAYS.map((d) => <option key={d} value={d}>{d} 日</option>)}
                </select>
              </div>
            </div>

            {/* Shichen */}
            <div className="flex flex-col gap-3">
              <p className="text-slate-400 text-sm">出生时辰</p>
              <div className="grid grid-cols-4 gap-1.5">
                {SHICHEN_LIST.map((s, idx) => (
                  <button
                    key={s.key}
                    onClick={() => setShichenIdx(idx)}
                    className={`flex flex-col items-center py-2 rounded-xl border text-xs transition-all cursor-pointer ${
                      shichenIdx === idx
                        ? "border-purple-400/60 bg-purple-900/30 text-purple-200"
                        : "border-slate-800 text-slate-500 hover:border-slate-700 hover:text-slate-400"
                    }`}
                  >
                    <span className="font-medium">{s.key}</span>
                    <span className="text-[10px] opacity-60 mt-0.5">{s.range}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Gender */}
            <div className="flex flex-col gap-3">
              <p className="text-slate-400 text-sm">性别</p>
              <div className="flex rounded-xl border border-slate-800 overflow-hidden w-48">
                <button
                  onClick={() => setGender("female")}
                  className={`flex-1 py-2.5 text-sm font-medium transition-all cursor-pointer border-r border-slate-800 ${
                    gender === "female" ? "bg-purple-900/30 text-purple-200" : "text-slate-500 hover:text-slate-400"
                  }`}
                >
                  女
                </button>
                <button
                  onClick={() => setGender("male")}
                  className={`flex-1 py-2.5 text-sm font-medium transition-all cursor-pointer ${
                    gender === "male" ? "bg-purple-900/30 text-purple-200" : "text-slate-500 hover:text-slate-400"
                  }`}
                >
                  男
                </button>
              </div>
            </div>

            {/* Focus area */}
            <div className="flex flex-col gap-3">
              <p className="text-slate-400 text-sm">关注方向</p>
              <div className="grid grid-cols-3 gap-2">
                {FOCUS_AREAS.map(({ key, emoji }) => (
                  <button
                    key={key}
                    onClick={() => setFocusArea(key)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm transition-all cursor-pointer ${
                      focusArea === key
                        ? "border-purple-400/60 bg-purple-900/20 text-white"
                        : "border-slate-800 text-slate-500 hover:border-slate-700 hover:text-slate-400"
                    }`}
                  >
                    <span>{emoji}</span>
                    <span>{FOCUS_LABELS[key]}</span>
                  </button>
                ))}
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={startReading}
              className="w-full py-4 rounded-full bg-gradient-to-r from-purple-700 to-indigo-700 text-white font-medium shadow-lg shadow-purple-500/20 cursor-pointer"
            >
              开始推算命盘
            </motion.button>
          </motion.div>
        )}

        {/* Reading */}
        {step === "reading" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full flex flex-col items-center gap-6">

            {/* Birth info summary */}
            <div className="w-full flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-slate-500 flex-wrap">
                <span>⭐</span>
                <span>{birthYear}年{birthMonth}月{birthDay}日</span>
                <span>·</span>
                <span>{shichen.key}</span>
                <span>·</span>
                <span>{gender === "female" ? "女" : "男"}</span>
                <span>·</span>
                <span className="text-purple-400/70">{FOCUS_LABELS[focusArea]}</span>
              </div>
              <button onClick={reset} className="text-slate-600 text-xs hover:text-slate-400 cursor-pointer shrink-0">
                重新测算
              </button>
            </div>

            {!output && isStreaming && <ReadingLoader />}

            {quotaError && (
              <div className="w-full rounded-2xl border border-amber-500/20 bg-amber-900/10 px-6 py-5 flex flex-col gap-3">
                <p className="text-amber-400/90 font-medium">API 调用额度不足</p>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {quotaError.retryAfter ? `请等约 ${quotaError.retryAfter} 秒后重试。` : "请稍后重试。"}
                  如持续出现，请前往火山方舟控制台检查账户余额或充值。
                </p>
                <button onClick={reset} className="text-slate-500 text-xs hover:text-slate-300 cursor-pointer text-left">
                  返回重新测算 →
                </button>
              </div>
            )}

            {output && (
              <ReadingOutput
                content={output}
                isStreaming={isStreaming}
                onFollowUp={handleFollowUp}
              />
            )}

            {!isStreaming && output && (
              <button
                onClick={reset}
                className="text-slate-600 text-xs hover:text-slate-400 transition-colors cursor-pointer pb-20"
              >
                重新测算
              </button>
            )}
          </motion.div>
        )}
      </div>
    </main>
  );
}
