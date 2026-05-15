import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "易经起卦",
  description: "AI 易经六十四卦解读。模拟铜钱起卦，获得针对你问题的卦辞解析与行动建议，传统周易智慧与现代 AI 深度结合。",
  keywords: ["AI易经", "易经起卦", "六十四卦", "铜钱起卦", "易经占卜", "周易解读"],
  alternates: { canonical: "/iching" },
  openGraph: {
    title: "AI 易经起卦 · 灵镜 AI",
    description: "AI 易经六十四卦解读，铜钱起卦，传统周易智慧与现代 AI 深度结合。",
    url: "/iching",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
