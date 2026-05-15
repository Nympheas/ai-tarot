import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "西方占星",
  description: "AI 西方占星星盘解读。根据出生日期、时间和城市，推算太阳星座、月亮星座、上升星座及内行星，提供深度个性化占星分析。",
  keywords: ["AI占星", "星盘解读", "上升星座", "月亮星座", "西方占星", "占星免费", "星座分析"],
  alternates: { canonical: "/astro" },
  openGraph: {
    title: "AI 西方占星 · 灵镜 AI",
    description: "AI 推算你的完整星盘——太阳、月亮、上升星座及行星位置。",
    url: "/astro",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
