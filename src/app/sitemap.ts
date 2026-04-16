import type { MetadataRoute } from "next";

import { testCatalog } from "@/lib/test-catalog";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sbti.orangemust.com";
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const homeEntry: MetadataRoute.Sitemap[number] = {
    changeFrequency: "daily",
    lastModified: new Date(),
    priority: 1,
    url: siteUrl,
  };
  const priorityByPath: Record<string, number> = {
    "/tests/herti": 0.95,
    "/tests/sbti": 0.9,
    "/tests/sdti": 0.85,
  };

  const liveTestEntries = testCatalog
    .filter((entry) => entry.status === "live")
    .map<MetadataRoute.Sitemap[number]>((entry) => ({
      changeFrequency: "weekly",
      lastModified: new Date(),
      priority: priorityByPath[entry.href] ?? 0.8,
      url: new URL(entry.href, siteUrl).toString(),
    }));

  return [
    homeEntry,
    ...liveTestEntries,
  ];
}
