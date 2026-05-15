import Link from "next/link";
import type { Metadata } from "next";
import { StarField } from "@/components/StarField";

export const metadata: Metadata = {
  title: "灵镜 AI · 智能占卜",
  description: "AI 驱动的中文占卜平台，提供塔罗牌解读、易经起卦、紫微斗数、西方占星和大众占卜。结合东西方传统命理与现代人工智能，首次免费体验。",
  alternates: { canonical: "/" },
  openGraph: {
    title: "灵镜 AI · 智能占卜",
    description: "AI 驱动的占卜平台，塔罗·易经·紫微·占星，首次免费。",
    url: "/",
  },
};

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#0a0a1a] text-white flex flex-col items-center justify-center px-4">
      <StarField />

      <div className="relative z-10 flex flex-col items-center gap-10 max-w-lg text-center">
        <div>
          <p className="text-purple-400 text-sm tracking-[0.3em] uppercase mb-4">灵镜 AI</p>
          <h1 className="text-5xl font-light tracking-wide text-white leading-tight">
            探索内心
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
              看见可能
            </span>
          </h1>
          <p className="text-slate-400 mt-6 leading-relaxed">
            结合传统塔罗与易经智慧，以 AI 为媒介，
            <br />
            开启一场深入内心的对话
          </p>
        </div>

        <div className="flex flex-col gap-4 w-full">
          <Link
            href="/tarot"
            className="w-full py-4 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium text-center shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-shadow"
          >
            🔮 塔罗解读
          </Link>
          <Link
            href="/iching"
            className="w-full py-4 rounded-full border border-purple-500/40 text-purple-300 text-center hover:border-purple-400 hover:text-purple-200 transition-colors"
          >
            ☯ 易经起卦
          </Link>
          <div className="grid grid-cols-3 gap-3">
            <Link href="/ziwei" className="py-3 rounded-2xl border border-white/10 text-slate-400 text-sm text-center hover:border-white/20 hover:text-slate-300 transition-colors">
              ⭐ 紫微斗数
            </Link>
            <Link href="/astro" className="py-3 rounded-2xl border border-white/10 text-slate-400 text-sm text-center hover:border-white/20 hover:text-slate-300 transition-colors">
              🌠 西方占星
            </Link>
            <Link href="/mass" className="py-3 rounded-2xl border border-white/10 text-slate-400 text-sm text-center hover:border-white/20 hover:text-slate-300 transition-colors">
              💕 大众占卜
            </Link>
          </div>
        </div>

        <section className="text-slate-600 text-xs leading-relaxed max-w-sm space-y-2">
          <p>
            灵镜 AI 是一款中文智能占卜平台，提供 <strong className="text-slate-500">AI 塔罗牌解读</strong>、
            <strong className="text-slate-500">易经六十四卦起卦</strong>、
            <strong className="text-slate-500">紫微斗数命盘分析</strong>、
            <strong className="text-slate-500">西方占星星盘解读</strong>
            和<strong className="text-slate-500">大众占卜内容生成</strong>。
          </p>
          <p>
            所有解读由 Google Gemini AI 生成，融合传统命理智慧与现代心理学视角，
            为每位用户提供个性化深度解析。首次占卜免费。
          </p>
          <p className="text-slate-700">仅供娱乐与自我探索，不构成任何专业建议</p>
          <p>
            <Link href="/privacy" className="text-slate-700 hover:text-slate-500 transition-colors underline underline-offset-2">
              隐私政策
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
