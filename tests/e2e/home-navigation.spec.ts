import { expect, test } from "@playwright/test";

test("shows multiple test entries on the home page and routes into sbti", async ({
  page,
}) => {
  await page.goto("/");

  await expect(page).toHaveTitle("人格测试题库｜SBTI · SDTI · HERTI");
  await expect(page.getByRole("heading", { name: "人格测试题库" })).toBeVisible();
  await expect(
    page.getByText(
      "这里不是单个测试页，而是一套正在持续扩展的题库站。当前项目保留 SBTI，并继续接入 SDTI 与 HERTI 两个新题库；每个题库都按原站逻辑做浏览器级取证、结果提取和本地重写。",
    ),
  ).toHaveCount(0);
  await expect(page.getByTestId("test-card-sbti")).toBeVisible();
  await expect(page.getByTestId("test-card-sdti")).toBeVisible();
  await expect(page.getByTestId("test-card-herti")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "SDTI 即将开放" }),
  ).toBeDisabled();
  await expect(
    page.getByRole("button", { name: "HERTI 即将开放" }),
  ).toBeDisabled();

  await page.getByRole("link", { name: "进入 SBTI" }).click();

  await expect(page).toHaveURL(/\/tests\/sbti$/);
  await expect(page.getByRole("button", { name: "开始测试" })).toBeVisible();
});

test("injects baidu analytics bootstrap script into head", async ({ page }) => {
  await page.goto("/");

  const baiduBootstrap = page.locator('head script[data-analytics="baidu-hm"]');

  await expect(baiduBootstrap).toHaveCount(1);
  const bootstrapContent = await baiduBootstrap.evaluate(
    (node) => node.textContent ?? "",
  );

  expect(bootstrapContent).toContain(
    "https://hm.baidu.com/hm.js?7683f719c9e5176f575fd5b68bdc1bf2",
  );
  expect(bootstrapContent).toContain("var _hmt = _hmt || [];");
});
