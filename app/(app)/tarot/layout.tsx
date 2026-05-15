import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "塔罗解读",
  description: "AI 塔罗牌三牌阵解读——过去、现在、未来。输入你的问题，抽取塔罗牌，获得深度个性化解析，融合心理学视角与传统塔罗象征。",
  keywords: ["AI塔罗", "塔罗牌解读", "在线塔罗", "三牌阵", "塔罗占卜"],
  alternates: { canonical: "/tarot" },
  openGraph: {
    title: "AI 塔罗解读 · 灵镜 AI",
    description: "AI 塔罗牌三牌阵解读——过去、现在、未来。获得深度个性化解析。",
    url: "/tarot",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
