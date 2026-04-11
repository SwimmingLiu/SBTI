import { describe, expect, it, vi } from "vitest";

import {
  buildProductionChecks,
  verifyProductionChecks,
} from "@/lib/production-verification";

describe("production verification helpers", () => {
  it("builds the expected homepage and route checks for the site", () => {
    const checks = buildProductionChecks("https://sbti.orangemust.com");

    expect(checks).toHaveLength(6);
    expect(checks.map((check) => check.path)).toEqual([
      "/",
      "/tests/sbti",
      "/tests/sdti",
      "/tests/herti",
      "/robots.txt",
      "/sitemap.xml",
    ]);
    expect(checks[0]?.expectedIncludes).toContain("人格测试题库");
    expect(checks[1]?.expectedIncludes).toContain(
      "Science Based Targets initiative",
    );
    expect(checks[4]?.expectedContentType).toBe("text/plain");
    expect(checks[5]?.expectedContentType).toEqual([
      "application/xml",
      "text/xml",
    ]);
  });

  it("flags wrong content types and missing page text", async () => {
    const fetcher = vi.fn(async (input: string) => {
      if (input.endsWith("/robots.txt")) {
        return new Response("<html>wrong</html>", {
          headers: { "content-type": "text/html; charset=utf-8" },
          status: 200,
        });
      }

      if (input.endsWith("/tests/sbti")) {
        return new Response("SBTI 人格测试", {
          headers: { "content-type": "text/html; charset=utf-8" },
          status: 200,
        });
      }

      return new Response("ok", {
        headers: { "content-type": "text/html; charset=utf-8" },
        status: 200,
      });
    });

    const results = await verifyProductionChecks(
      [
        {
          expectedContentType: "text/html",
          expectedIncludes: ["SBTI 人格测试", "Science Based Targets initiative"],
          path: "/tests/sbti",
          url: "https://sbti.orangemust.com/tests/sbti",
        },
        {
          expectedContentType: "text/plain",
          expectedIncludes: ["User-Agent: *"],
          path: "/robots.txt",
          url: "https://sbti.orangemust.com/robots.txt",
        },
      ],
      fetcher,
    );

    expect(results[0]?.ok).toBe(false);
    expect(results[0]?.errors).toContain(
      'missing text: "Science Based Targets initiative"',
    );
    expect(results[1]?.ok).toBe(false);
    expect(results[1]?.errors).toContain(
      'content-type mismatch: expected "text/plain", got "text/html; charset=utf-8"',
    );
  });

  it("marks a check as passing when content type and key phrases match", async () => {
    const results = await verifyProductionChecks(
      [
        {
          expectedContentType: ["application/xml", "text/xml"],
          expectedIncludes: ["/tests/sbti", "/tests/sdti", "/tests/herti"],
          path: "/sitemap.xml",
          url: "https://sbti.orangemust.com/sitemap.xml",
        },
      ],
      async () =>
        new Response(
          `<?xml version="1.0" encoding="UTF-8"?>
<urlset>
  <url><loc>https://sbti.orangemust.com/tests/sbti</loc></url>
  <url><loc>https://sbti.orangemust.com/tests/sdti</loc></url>
  <url><loc>https://sbti.orangemust.com/tests/herti</loc></url>
</urlset>`,
          {
            headers: { "content-type": "application/xml; charset=utf-8" },
            status: 200,
          },
        ),
    );

    expect(results[0]?.ok).toBe(true);
    expect(results[0]?.errors).toEqual([]);
  });
});
