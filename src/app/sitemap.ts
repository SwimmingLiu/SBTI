import type { MetadataRoute } from "next";

import { testCatalog } from "@/lib/test-catalog";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sbti.unun.dev";
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const homeEntry: MetadataRoute.Sitemap[number] = {
    changeFrequency: "daily",
    lastModified: new Date(),
    priority: 1,
    url: siteUrl,
  };

  const liveTestEntries = testCatalog
    .filter((entry) => entry.status === "live")
    .map<MetadataRoute.Sitemap[number]>((entry) => ({
      changeFrequency: "weekly",
      lastModified: new Date(),
      priority: 0.9,
      url: `${siteUrl}${entry.href}`,
    }));

  return [
    homeEntry,
    {
      changeFrequency: "weekly",
      lastModified: new Date(),
      priority: 0.7,
      url: `${siteUrl}/tests`,
    },
    ...liveTestEntries,
  ];
}
