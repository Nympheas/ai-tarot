import { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://ai-tarot-sage.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE_URL,                  lastModified: new Date(), changeFrequency: "monthly",  priority: 1.0 },
    { url: `${BASE_URL}/tarot`,       lastModified: new Date(), changeFrequency: "monthly",  priority: 0.9 },
    { url: `${BASE_URL}/iching`,      lastModified: new Date(), changeFrequency: "monthly",  priority: 0.9 },
    { url: `${BASE_URL}/ziwei`,       lastModified: new Date(), changeFrequency: "monthly",  priority: 0.9 },
    { url: `${BASE_URL}/astro`,       lastModified: new Date(), changeFrequency: "monthly",  priority: 0.9 },
    { url: `${BASE_URL}/mass`,        lastModified: new Date(), changeFrequency: "monthly",  priority: 0.8 },
  ];
}
