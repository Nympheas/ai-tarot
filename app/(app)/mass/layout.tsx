import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "大众占卜",
  description: "AI 大众塔罗占卜，三组同场解读。爱情、事业、财富、能量四大主题，验证牌锁定你的星座状态，解读牌深度分析问题，感情运势、事业运势一键生成。",
  keywords: ["大众占卜", "大众塔罗", "爱情运势", "事业运势", "财富运势", "塔罗博主", "感情塔罗"],
  alternates: { canonical: "/mass" },
  openGraph: {
    title: "AI 大众占卜 · 灵镜 AI",
    description: "三组同场塔罗解读，爱情·事业·财富·能量，AI 为占卜博主一键生成内容。",
    url: "/mass",
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
