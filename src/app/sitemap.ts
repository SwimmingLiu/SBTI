import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sbti.unun.dev";
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      changeFrequency: "daily",
      lastModified: new Date(),
      priority: 1,
      url: siteUrl,
    },
  ];
}
