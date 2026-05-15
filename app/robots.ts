import { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://ai-tarot-sage.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/tarot", "/iching", "/ziwei", "/astro", "/mass"],
        disallow: ["/api/", "/history", "/payment/"],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
