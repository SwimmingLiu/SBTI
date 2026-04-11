export type ProductionCheck = {
  expectedContentType: string;
  expectedIncludes: string[];
  path: string;
  url: string;
};

export type ProductionCheckResult = ProductionCheck & {
  actualContentType: string;
  errors: string[];
  ok: boolean;
  status: number;
};

type FetchLike = typeof fetch;

function normalizeSiteUrl(siteUrl: string) {
  return siteUrl.replace(/\/+$/, "");
}

export function buildProductionChecks(siteUrl: string): ProductionCheck[] {
  const normalizedSiteUrl = normalizeSiteUrl(siteUrl);

  return [
    {
      expectedContentType: "text/html",
      expectedIncludes: [
        "人格测试题库",
        "SBTI 人格测试",
        "SDTI 人格测评",
        "HERTI 她的人格测评",
      ],
      path: "/",
      url: `${normalizedSiteUrl}/`,
    },
    {
      expectedContentType: "text/html",
      expectedIncludes: [
        "SBTI 人格测试",
        "SBTI 测评入口",
        "Science Based Targets initiative",
      ],
      path: "/tests/sbti",
      url: `${normalizedSiteUrl}/tests/sbti`,
    },
    {
      expectedContentType: "text/html",
      expectedIncludes: ["SDTI 人格测评", "32 道题", "Feminist"],
      path: "/tests/sdti",
      url: `${normalizedSiteUrl}/tests/sdti`,
    },
    {
      expectedContentType: "text/html",
      expectedIncludes: ["HERTI 她的人格测评", "16 位女性原型", "镜像人格"],
      path: "/tests/herti",
      url: `${normalizedSiteUrl}/tests/herti`,
    },
    {
      expectedContentType: "text/plain",
      expectedIncludes: ["User-Agent: *", "Sitemap:"],
      path: "/robots.txt",
      url: `${normalizedSiteUrl}/robots.txt`,
    },
    {
      expectedContentType: "application/xml",
      expectedIncludes: ["/tests/sbti", "/tests/sdti", "/tests/herti"],
      path: "/sitemap.xml",
      url: `${normalizedSiteUrl}/sitemap.xml`,
    },
  ];
}

export async function verifyProductionChecks(
  checks: ProductionCheck[],
  fetcher: FetchLike = fetch,
): Promise<ProductionCheckResult[]> {
  const results = await Promise.all(
    checks.map(async (check) => {
      const response = await fetcher(check.url);
      const actualContentType = response.headers.get("content-type") ?? "";
      const body = await response.text();
      const errors: string[] = [];

      if (!response.ok) {
        errors.push(`http status: ${response.status}`);
      }

      if (!actualContentType.includes(check.expectedContentType)) {
        errors.push(
          `content-type mismatch: expected "${check.expectedContentType}", got "${actualContentType}"`,
        );
      }

      for (const expectedText of check.expectedIncludes) {
        if (!body.includes(expectedText)) {
          errors.push(`missing text: "${expectedText}"`);
        }
      }

      return {
        ...check,
        actualContentType,
        errors,
        ok: errors.length === 0,
        status: response.status,
      };
    }),
  );

  return results;
}
