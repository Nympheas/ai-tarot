"use client";

import { useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { drawAddedCards } from "@/lib/divination/added-cards";
import { ALL_CARDS } from "@/lib/divination/tarot-cards";
import { addedCardList, ADDED_POSITIONS, type AddedReading } from "@/lib/prompts/mass-added-card";
import { type MassPersonality, type MassTheme, THEME_LABELS } from "@/lib/prompts/mass";
import { saveReading } from "@/lib/storage";
import { PaywallModal } from "@/components/PaywallModal";

type Props = { theme: MassTheme; question: string; personality: MassPersonality };
type Snapshot = { reading: AddedReading; content: string };
const GROUPS = [{ symbol: "🔮", name: "紫水晶" }, { symbol: "🌙", name: "月光石" }, { symbol: "✨", name: "黄水晶" }];
const field = "rounded-lg bg-slate-900 border border-slate-700 text-slate-200 text-sm px-3 py-2 w-full";

export function MassAddedReading(props: Props) {
  const [baseCount, setBaseCount] = useState(3);
  const [started, setStarted] = useState(false);
  return <div className="flex flex-col gap-5">
    <label className="text-sm text-slate-400">基础牌阵
      <select aria-label="加牌基础牌阵" className={`${field} mt-2`} disabled={started} value={baseCount} onChange={e => setBaseCount(Number(e.target.value))}>
        <option value={3}>三张牌：头脑、忠告、结果</option>
        <option value={4}>四张牌：头脑、忠告、结果、关系人</option>
      </select>
    </label>
    <p className="text-xs text-slate-500">先解读基础牌，再为具体疑问加牌。信息已经清楚或越抽越困惑时，可以停在当前解读。每次生成解读沿用现有次数规则。</p>
    {GROUPS.map((g, i) => <AddedGroup key={i} {...props} number={i + 1} symbol={g.symbol} name={g.name} baseCount={baseCount} onStart={() => setStarted(true)} />)}
  </div>;
}
function AddedGroup({ theme, question, personality, number, symbol, name, baseCount, onStart }: Props & { number: number; symbol: string; name: string; baseCount: number; onStart: () => void }) {
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [pending, setPending] = useState<AddedReading | null>(null);
  const [loading, setLoading] = useState(false);
  const busy = useRef(false);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState("");
  const [paywall, setPaywall] = useState(false);
  const [target, setTarget] = useState(0);
  const [purpose, setPurpose] = useState("");
  const [count, setCount] = useState(1);
  const current = snapshots.at(-1)?.reading;
  const visible = pending ?? current;
  const all = visible ? addedCardList(visible) : [];

  async function generate(reading: AddedReading) {
    if (busy.current) return;
    busy.current = true;
    onStart();
    setPending(reading); setLoading(true); setError(""); setDraft("");
    try {
      const res = await fetch("/api/divination", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "mass", spread: "added-card", theme, question, personality, groupNumber: number, groupSymbol: symbol, ...reading, messages: [] }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        if (res.status === 402) setPaywall(true);
        throw new Error(res.status === 401 ? "请先登录后再生成解读。" : res.status === 402 ? "可用次数不足，请补充后重试。" : res.status === 429 ? "请求较多，请稍后重试。" : data.error || "生成失败，请重试。");
      }
      if (!res.body) throw new Error("未收到解读内容，请重试。");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let content = "";
      while (true) {
        const chunk = await reader.read();
        if (chunk.done) break;
        content += decoder.decode(chunk.value, { stream: true }); setDraft(content);
      }
      content += decoder.decode();
      if (!content.trim()) throw new Error("未收到解读内容，请重试。");
      setSnapshots(prev => [...prev, { reading, content }]);
      setPending(null); setDraft(""); setPurpose("");
      try {
        saveReading({ type: "tarot", question: `大众占卜 · ${THEME_LABELS[theme]} · 第${number}组 · ${question}`, result: content,
          metadata: { spread: "added-card", massTheme: theme, group: number, question, personality, ...reading } });
      } catch { setError("解读已完成，但浏览器未能保存历史记录。"); }
    } catch (err) { setError(err instanceof Error ? err.message : "网络连接失败，请重试。"); }
    finally { busy.current = false; setLoading(false); }
  }
  function add() {
    if (!current || !purpose.trim() || busy.current || pending) return;
    const cards = drawAddedCards(count, current);
    if (cards.length !== count) return;
    void generate({ ...current, additions: [...current.additions, { target, purpose: purpose.trim(), cards }] });
  }
  return <section aria-label={`加牌第${number}组`} className="rounded-2xl border border-purple-500/30 bg-purple-900/10 p-5 flex flex-col gap-4">
    <div className="flex items-center justify-between gap-3">
      <p className="text-white text-sm">{symbol} 第 {number} 组 · {name}</p>
      {!visible && <button className="text-sm text-purple-200 cursor-pointer" disabled={loading} onClick={() => generate({ readingCards: drawAddedCards(baseCount), additions: [] })}>生成第 {number} 组</button>}
    </div>
    {visible && <ol className="text-xs text-slate-400 space-y-2">
      {all.map((c, i) => <li key={i}>第{i + 1}张 · {i < visible.readingCards.length ? ADDED_POSITIONS[i] : "补充牌"}：{c.nameZh}（{c.isReversed ? "逆位" : "正位"}）</li>)}
      {visible.additions.map((a, i) => <li key={`a${i}`} className="text-purple-300">第{i + 1}次加牌 → 第{a.target + 1}张 {all[a.target].nameZh}：{a.purpose}</li>)}
    </ol>}
    {snapshots.map((s, i) => i === snapshots.length - 1
      ? <div key={i} className="prose prose-invert prose-sm max-w-none"><ReactMarkdown>{s.content}</ReactMarkdown></div>
      : <details key={i} className="text-slate-400 text-sm"><summary className="cursor-pointer">{i === 0 ? "基础牌解读" : `第${i}次加牌解读`}（保留记录）</summary><div className="prose prose-invert prose-sm max-w-none"><ReactMarkdown>{s.content}</ReactMarkdown></div></details>)}
    {loading && <p role="status" className="text-purple-300 text-sm">正在解读，请稍候…</p>}
    {draft && <div className="prose prose-invert prose-sm max-w-none"><ReactMarkdown>{draft}</ReactMarkdown></div>}
    {error && <p role="alert" className="text-amber-300 text-sm">{error}</p>}
    {pending && !loading && <button onClick={() => generate(pending)} className="text-purple-200 text-sm cursor-pointer">保留当前牌重试</button>}
    {current && !pending && !loading && <div className="border-t border-white/10 pt-4 flex flex-col gap-3">
      <label className="text-sm text-slate-400">需要补充的牌
        <select aria-label={`第${number}组补充目标`} className={`${field} mt-1`} value={target} onChange={e => setTarget(Number(e.target.value))}>
          {addedCardList(current).map((c, i) => <option key={i} value={i}>第{i + 1}张 · {i < current.readingCards.length ? ADDED_POSITIONS[i] : "补充牌"} · {c.nameZh}</option>)}
        </select>
      </label>
      <label className="text-sm text-slate-400">加牌目的
        <textarea aria-label={`第${number}组加牌目的`} className={`${field} mt-1`} maxLength={500} rows={2} value={purpose} onChange={e => setPurpose(e.target.value)} placeholder="例如：这张牌提示要有勇气，具体是在哪件事上？" />
      </label>
      <label className="text-sm text-slate-400">本次加牌数量
        <select aria-label={`第${number}组加牌数量`} className={`${field} mt-1`} value={count} onChange={e => setCount(Number(e.target.value))}><option value={1}>1 张</option><option value={2}>2 张（共同补充同一个疑问）</option></select>
      </label>
      <button disabled={!purpose.trim() || all.length + count > ALL_CARDS.length} onClick={add} className="rounded-xl bg-purple-800 py-2.5 text-white text-sm disabled:opacity-40 cursor-pointer">抽取补充牌并解读</button>
      {all.length + count > ALL_CARDS.length && <p className="text-xs text-slate-500">剩余牌数不足，请保留当前解读。</p>}
    </div>}
    <PaywallModal open={paywall} onClose={() => setPaywall(false)} />
  </section>;
}
