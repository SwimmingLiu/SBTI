import { expect, test } from "@playwright/test";

test("shows multiple test entries on the home page and routes into sbti", async ({
  page,
}) => {
  await page.goto("/");

  await expect(page).toHaveTitle(
    "人格测试题库｜SBTI 人格测试 · SDTI 人格测评 · HERTI 她的人格测评",
  );
  await expect(page.getByRole("heading", { name: "人格测试题库" })).toBeVisible();
  await expect(
    page.getByText(
      "这里不是单个测试页，而是一套正在持续扩展的题库站。当前项目保留 SBTI，并继续接入 SDTI 与 HERTI 两个新题库；每个题库都按原站逻辑做浏览器级取证、结果提取和本地重写。",
    ),
  ).toHaveCount(0);
  await expect(page.getByTestId("test-card-sbti")).toBeVisible();
  await expect(page.getByTestId("test-card-sdti")).toBeVisible();
  await expect(page.getByTestId("test-card-herti")).toBeVisible();
  await expect(page.getByRole("link", { name: "进入 SDTI" })).toBeVisible();
  await expect(page.getByRole("link", { name: "进入 HERTI" })).toBeVisible();

  await page.getByRole("link", { name: "进入 SBTI" }).click();

  await expect(page).toHaveURL(/\/tests\/sbti$/);
  await expect(page.getByText(/第 1 题/)).toBeVisible();
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
  expect(bootstrapContent).toContain('document.createElement("script")');
});

test("keeps home card titles and status badges on one line", async ({ page }) => {
  await page.goto("/");

  const hertiCard = page.getByTestId("test-card-herti");
  const statusBadge = hertiCard.getByText("已开放", { exact: true });
  const title = hertiCard.getByRole("heading", { name: "HERTI 她的人格测评" });

  await expect(statusBadge).toBeVisible();
  await expect(title).toBeVisible();

  const statusWhiteSpace = await statusBadge.evaluate(
    (node) => window.getComputedStyle(node).whiteSpace,
  );
  const titleWhiteSpace = await title.evaluate(
    (node) => window.getComputedStyle(node).whiteSpace,
  );

  expect(statusWhiteSpace).toBe("nowrap");
  expect(titleWhiteSpace).toBe("nowrap");
});

test("shows the bilingual library chip copy on the home page", async ({ page }) => {
  await page.goto("/?disableMiniProgramRedirect=1");

  const libraryChip = page.getByTestId("home-library-chip");

  await expect(libraryChip).toBeVisible();
  await expect(libraryChip).toContainText("PERSONA TEST LIBRARY");
  await expect(libraryChip).toContainText("人格测评库");
});

test("keeps compact home cards inside the library shell", async ({ page }) => {
  await page.setViewportSize({ width: 765, height: 1235 });
  await page.goto("/?disableMiniProgramRedirect=1");

  const libraryShell = page.getByTestId("home-library-grid-shell");

  await expect(libraryShell).toBeVisible();

  const shellBox = await libraryShell.boundingBox();

  expect(shellBox).not.toBeNull();

  for (const slug of ["sbti", "sdti", "herti"]) {
    const cardBox = await page.getByTestId(`test-card-${slug}`).boundingBox();

    expect(cardBox).not.toBeNull();
    expect(cardBox!.x).toBeGreaterThanOrEqual(shellBox!.x);
    expect(cardBox!.y).toBeGreaterThanOrEqual(shellBox!.y);
    expect(cardBox!.x + cardBox!.width).toBeLessThanOrEqual(
      shellBox!.x + shellBox!.width,
    );
    expect(cardBox!.y + cardBox!.height).toBeLessThanOrEqual(
      shellBox!.y + shellBox!.height,
    );
  }
});

test("shows a visible answer-rich support panel on the home page", async ({
  page,
}) => {
  await page.goto("/");

  const seoContent = page.getByTestId("home-answer-rich-panel");

  await expect(seoContent).toHaveCount(1);
  await expect(seoContent).toContainText("SBTI 和 SBTi 有什么不同");
  await expect(seoContent).toContainText("这里的 SBTI 指人格测试");
  await expect(seoContent).not.toContainText("FWTI");
  await expect(seoContent).toBeVisible();
});
