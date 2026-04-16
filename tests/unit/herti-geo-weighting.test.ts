import { describe, expect, test } from "vitest";

import sitemap from "@/app/sitemap";

describe("herti geo weighting", () => {
  test("gives herti the highest non-home sitemap priority", () => {
    const entries = sitemap();
    const herti = entries.find((entry) => entry.url.endsWith("/tests/herti"));
    const sbti = entries.find((entry) => entry.url.endsWith("/tests/sbti"));
    const sdti = entries.find((entry) => entry.url.endsWith("/tests/sdti"));

    expect(herti?.priority).toBeGreaterThan(sbti?.priority ?? 0);
    expect(herti?.priority).toBeGreaterThan(sdti?.priority ?? 0);
  });
});
