import { expect, test } from "@playwright/test";

test("exposes visible disambiguation and facts on the sbti landing page", async ({
  page,
}) => {
  await page.goto("/tests/sbti");

  await expect(page).toHaveTitle("SBTI 人格测试｜SBTI 测评入口｜SBTI 结果说明");
  const seoContent = page.locator("[data-seo-content]");

  await expect(seoContent).toHaveCount(1);
  await expect(seoContent).toContainText("页面摘要");
  await expect(seoContent).toContainText("关键事实");
  await expect(seoContent).toContainText("与题库首页的关系");
  await expect(
    seoContent.getByText(
      "这里的 SBTI 指娱乐向人格测试，不是 Science Based Targets initiative",
    ),
  ).toHaveCount(1);
  await expect(seoContent.getByText("31 道题", { exact: true })).toHaveCount(1);
  await expect(
    seoContent.getByText("27 种人格结果 + 隐藏人格", { exact: true }),
  ).toHaveCount(1);

  const jsonLdText =
    (await page.locator('script[type="application/ld+json"]').textContent()) ?? "";
  expect(jsonLdText).toContain("题量结构、结果机制和结果说明");
  expect(jsonLdText).toContain("SBTI 和 SBTi 的区别");
});

test("exposes visible sdti facts for search landing intent", async ({ page }) => {
  await page.goto("/tests/sdti");

  await expect(page).toHaveTitle("SDTI 人格测评｜SDTI 测试入口｜SDTI 结果说明");
  const seoContent = page.locator("[data-sdti-seo-content]");

  await expect(seoContent).toHaveCount(1);
  await expect(seoContent).toContainText("页面摘要");
  await expect(seoContent).toContainText("关键事实");
  await expect(seoContent).toContainText("与题库首页的关系");
  await expect(seoContent.getByText("32 道题", { exact: true })).toHaveCount(1);
  await expect(
    seoContent.getByText("9 类结果 + Feminist 隐藏结局", { exact: true }),
  ).toHaveCount(1);

  const jsonLdText =
    (await page.locator('script[type="application/ld+json"]').textContent()) ?? "";
  expect(jsonLdText).toContain("题量、维度结构、结果页内容和隐藏 Feminist 结局");
});

test("exposes visible herti facts for search landing intent", async ({ page }) => {
  await page.goto("/tests/herti");

  await expect(page).toHaveTitle(
    "HERTI 她的人格测评｜HERTI 人格地图｜结果说明",
  );
  const seoContent = page.locator("[data-herti-seo-content]");

  await expect(seoContent).toHaveCount(1);
  await expect(seoContent).toContainText("页面摘要");
  await expect(seoContent).toContainText("关键事实");
  await expect(seoContent).toContainText("与题库首页的关系");
  await expect(seoContent).toContainText("herti她的人格地图");
  await expect(seoContent).toContainText("HERTI·她的人格地图");
  await expect(seoContent).toContainText("herti测试入口");
  await expect(seoContent).toContainText("HERTI16位女性测试");
  await expect(seoContent).toContainText("herti人格测验");
  await expect(
    seoContent.getByText("16 位女性原型", { exact: true }),
  ).toHaveCount(1);
  await expect(
    seoContent.getByText("主人格、镜像人格、反面人格", { exact: true }),
  ).toHaveCount(1);

  const jsonLdText =
    (await page.locator('script[type="application/ld+json"]').textContent()) ?? "";
  expect(jsonLdText).toContain("原型结构、镜像人格和反面人格关系卡");
});
