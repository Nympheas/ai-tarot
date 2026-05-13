"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ReadingOutput } from "@/components/tarot/ReadingOutput";
import { ReadingLoader } from "@/components/ReadingLoader";
import { saveReading } from "@/lib/storage";
import {
  AstroFocusArea,
  FOCUS_LABELS,
  COMMON_CITIES,
  getSunSign,
} from "@/lib/prompts/astro";

type Step = "setup" | "reading";
type Message = { role: "user" | "assistant"; content: string };

const FOCUS_AREAS: { key: AstroFocusArea; emoji: string }[] = [
  { key: "overall", emoji: "🌌" },
  { key: "love",    emoji: "💕" },
  { key: "career",  emoji: "🚀" },
  { key: "purpose", emoji: "🧭" },
  { key: "inner",   emoji: "🌙" },
  { key: "recent",  emoji: "✨" },
];

const MONTHS = Array.from({ length: 12 }, (_, i) => i + 1);
const DAYS   = Array.from({ length: 31 }, (_, i) => i + 1);
const HOURS  = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

export default function AstroPage() {
  const [step, setStep]           = useState<Step>("setup");
  const [birthYear, setBirthYear] = useState(1995);
  const [birthMonth, setBirthMonth] = useState(6);
  const [birthDay, setBirthDay]   = useState(15);
  const [birthHour, setBirthHour] = useState(8);
  const [birthMinute, setBirthMinute] = useState(0);
  const [birthCity, setBirthCity] = useState("北京");
  const [customCity, setCustomCity] = useState("");
  const [focusArea, setFocusArea] = useState<AstroFocusArea>("overall");
  const [output, setOutput]       = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [messages, setMessages]   = useState<Message[]>([]);
  const [quotaError, setQuotaError] = useState<{ retryAfter?: number } | null>(null);

  const effectiveCity = birthCity === "其他" ? customCity : birthCity;
  const sunSign = getSunSign(birthMonth, birthDay);

  async function startReading() {
    setStep("reading");
    setOutput("");
    setIsStreaming(true);
    setQuotaError(null);

    const res = await fetch("/api/divination", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "astro",
        birthYear, birthMonth, birthDay,
        birthHour, birthMinute,
        birthCity: effectiveCity,
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
    const summary = `${birthYear}年${birthMonth}月${birthDay}日 ${String(birthHour).padStart(2,"0")}:${String(birthMinute).padStart(2,"0")} ${effectiveCity} · ${sunSign.symbol}${sunSign.sign}`;
    setMessages([
      { role: "user",      content: summary },
      { role: "assistant", content: full },
    ]);
    saveReading({ type: "tarot" as "tarot", question: summary, result: full, metadata: { birthYear, birthMonth, birthDay, birthHour, birthMinute, birthCity: effectiveCity, focusArea } });
  }

  async function handleFollowUp(q: string) {
    setIsStreaming(true);
    const newMessages: Message[] = [...messages, { role: "user", content: q }];

    const res = await fetch("/api/divination", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "astro",
        birthYear, birthMonth, birthDay,
        birthHour, birthMinute,
        birthCity: effectiveCity,
        focusArea,
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
    <main className="min-h-screen bg-[#04040e] text-white px-4 py-12 pb-28">
      <div className="max-w-2xl mx-auto flex flex-col items-center gap-8">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <h1 className="text-3xl font-light tracking-widest text-blue-200">星盘占星</h1>
          <p className="text-slate-500 mt-2 text-sm">太阳 · 月亮 · 上升 · 本命星盘解读</p>
        </motion.div>

        {/* Setup */}
        {step === "setup" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full flex flex-col gap-6">

            {/* Birth date */}
            <div className="flex flex-col gap-3">
              <p className="text-slate-400 text-sm">出生日期</p>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={birthYear}
                  onChange={(e) => setBirthYear(Number(e.target.value))}
                  min={1920} max={2010}
                  className="w-24 rounded-xl bg-slate-900/80 border border-blue-500/20 text-white text-sm px-3 py-2.5 outline-none focus:border-blue-400/50 text-center [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
                />
                <span className="text-slate-500 text-sm">年</span>
                <select
                  value={birthMonth}
                  onChange={(e) => setBirthMonth(Number(e.target.value))}
                  className="flex-1 rounded-xl bg-slate-900/80 border border-blue-500/20 text-white text-sm px-3 py-2.5 outline-none focus:border-blue-400/50 cursor-pointer"
                >
                  {MONTHS.map((m) => <option key={m} value={m}>{m} 月</option>)}
                </select>
                <select
                  value={birthDay}
                  onChange={(e) => setBirthDay(Number(e.target.value))}
                  className="flex-1 rounded-xl bg-slate-900/80 border border-blue-500/20 text-white text-sm px-3 py-2.5 outline-none focus:border-blue-400/50 cursor-pointer"
                >
                  {DAYS.map((d) => <option key={d} value={d}>{d} 日</option>)}
                </select>
              </div>
              {/* Sun sign preview */}
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-blue-900/10 border border-blue-500/15 w-fit">
                <span className="text-lg">{sunSign.symbol}</span>
                <span className="text-blue-300 text-sm">太阳星座：{sunSign.sign}</span>
              </div>
            </div>

            {/* Birth time */}
            <div className="flex flex-col gap-3">
              <p className="text-slate-400 text-sm">出生时间 <span className="text-slate-600 text-xs ml-1">（用于推算月亮和上升星座）</span></p>
              <div className="flex items-center gap-2">
                <select
                  value={birthHour}
                  onChange={(e) => setBirthHour(Number(e.target.value))}
                  className="flex-1 rounded-xl bg-slate-900/80 border border-blue-500/20 text-white text-sm px-3 py-2.5 outline-none focus:border-blue-400/50 cursor-pointer"
                >
                  {HOURS.map((h) => (
                    <option key={h} value={h}>{String(h).padStart(2, "0")} 时</option>
                  ))}
                </select>
                <select
                  value={birthMinute}
                  onChange={(e) => setBirthMinute(Number(e.target.value))}
                  className="flex-1 rounded-xl bg-slate-900/80 border border-blue-500/20 text-white text-sm px-3 py-2.5 outline-none focus:border-blue-400/50 cursor-pointer"
                >
                  {MINUTES.map((m) => (
                    <option key={m} value={m}>{String(m).padStart(2, "0")} 分</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Birth city */}
            <div className="flex flex-col gap-3">
              <p className="text-slate-400 text-sm">出生城市 <span className="text-slate-600 text-xs ml-1">（用于推算上升星座）</span></p>
              <div className="flex flex-wrap gap-1.5">
                {[...COMMON_CITIES, "其他"].map((city) => (
                  <button
                    key={city}
                    onClick={() => setBirthCity(city)}
                    className={`px-3 py-1.5 rounded-full text-xs border transition-all cursor-pointer ${
                      birthCity === city
                        ? "border-blue-400 bg-blue-500/20 text-blue-200"
                        : "border-slate-700 text-slate-500 hover:border-blue-500/40 hover:text-slate-400"
                    }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
              {birthCity === "其他" && (
                <input
                  value={customCity}
                  onChange={(e) => setCustomCity(e.target.value)}
                  placeholder="输入出生城市..."
                  className="w-full rounded-xl bg-slate-900/80 border border-blue-500/20 text-white text-sm px-4 py-2.5 outline-none focus:border-blue-400/50 placeholder:text-slate-600"
                />
              )}
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
                        ? "border-blue-400/60 bg-blue-900/20 text-white"
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
              disabled={birthCity === "其他" && !customCity.trim()}
              onClick={startReading}
              className="w-full py-4 rounded-full bg-gradient-to-r from-blue-700 to-indigo-700 text-white font-medium shadow-lg shadow-blue-500/20 cursor-pointer disabled:opacity-30"
            >
              解读我的星盘
            </motion.button>
          </motion.div>
        )}

        {/* Reading */}
        {step === "reading" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="w-full flex flex-col items-center gap-6">

            {/* Summary bar */}
            <div className="w-full flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-slate-500 flex-wrap">
                <span>{sunSign.symbol}</span>
                <span>{birthYear}年{birthMonth}月{birthDay}日</span>
                <span>·</span>
                <span>{String(birthHour).padStart(2,"0")}:{String(birthMinute).padStart(2,"0")}</span>
                <span>·</span>
                <span>{effectiveCity}</span>
                <span>·</span>
                <span className="text-blue-400/70">{FOCUS_LABELS[focusArea]}</span>
              </div>
              <button onClick={reset} className="text-slate-600 text-xs hover:text-slate-400 cursor-pointer shrink-0">
                重新测算
              </button>
            </div>

            {!output && isStreaming && <ReadingLoader />}

            {quotaError && (
              <div className="w-full rounded-2xl border border-amber-500/20 bg-amber-900/10 px-6 py-5 flex flex-col gap-3">
                <p className="text-amber-400/90 font-medium">今日免费额度已用完</p>
                <p className="text-slate-400 text-sm leading-relaxed">
                  Gemini 免费版每天限 20 次请求。
                  {quotaError.retryAfter ? `请等约 ${quotaError.retryAfter} 秒后重试，或` : "请"}
                  前往 Google AI Studio 开启计费，配额会提升到每天 1500 次。
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
