import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "紫微斗数",
  description: "AI 紫微斗数命盘解读。输入出生年月日时辰，AI 推算命宫主星、三方四正格局、大限运势，给出深入的命理分析与人生建议。",
  keywords: ["AI紫微斗数", "紫微斗数命盘", "命宫主星", "大限运势", "命理分析", "紫微斗数免费"],
  alternates: { canonical: "/ziwei" },
  openGraph: {
    title: "AI 紫微斗数 · 灵镜 AI",
    description: "AI 推算紫微斗数命盘，分析命宫主星、格局与运势。",
    url: "/ziwei",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
