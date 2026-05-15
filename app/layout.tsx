import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://ai-tarot-sage.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "灵镜 AI · 智能占卜",
    template: "%s · 灵镜 AI",
  },
  description: "灵镜 AI 是一款 AI 驱动的占卜应用，提供塔罗牌解读、易经起卦、紫微斗数命盘、西方占星和大众占卜。结合传统东西方命理智慧与现代人工智能，为你提供深度个性化的解读。",
  keywords: ["AI占卜", "AI塔罗", "塔罗牌解读", "易经起卦", "紫微斗数", "AI占星", "在线占卜", "命理分析", "大众占卜", "灵镜AI"],
  authors: [{ name: "灵镜 AI" }],
  creator: "灵镜 AI",
  openGraph: {
    type: "website",
    locale: "zh_CN",
    url: BASE_URL,
    siteName: "灵镜 AI",
    title: "灵镜 AI · 智能占卜",
    description: "结合塔罗、易经、紫微斗数与占星，以 AI 为媒介，开启深入内心的对话。免费体验，首次占卜无需付费。",
  },
  twitter: {
    card: "summary_large_image",
    title: "灵镜 AI · 智能占卜",
    description: "结合塔罗、易经、紫微斗数与占星，以 AI 为媒介，开启深入内心的对话。",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  alternates: {
    canonical: BASE_URL,
  },
};

const hasClerkKeys =
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY &&
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY !== "your_clerk_publishable_key";

function MaybeClerk({ children }: { children: React.ReactNode }) {
  if (!hasClerkKeys) return <>{children}</>;
  return <ClerkProvider>{children}</ClerkProvider>;
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <MaybeClerk>
      <html
        lang="zh-CN"
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      >
        <body className="min-h-full flex flex-col">
          {children}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "WebApplication",
                name: "灵镜 AI",
                url: BASE_URL,
                description: "AI 驱动的占卜应用，提供塔罗牌、易经、紫微斗数、占星和大众占卜解读",
                applicationCategory: "Entertainment",
                operatingSystem: "Any",
                inLanguage: "zh-CN",
                offers: {
                  "@type": "Offer",
                  price: "0",
                  priceCurrency: "CNY",
                  description: "首次占卜免费",
                },
                featureList: [
                  "AI塔罗牌三牌阵解读",
                  "易经六十四卦铜钱起卦",
                  "紫微斗数命盘分析",
                  "西方占星星盘解读",
                  "大众占卜三组同场解读",
                ],
              }),
            }}
          />
        </body>
      </html>
    </MaybeClerk>
  );
}
