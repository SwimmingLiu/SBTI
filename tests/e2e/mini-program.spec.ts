import { expect, test } from "@playwright/test";

test("opens the mini program code dialog from the intro screen", async ({
  page,
}) => {
  await page.goto("/tests/sbti");

  await page.getByRole("button", { name: "查看小程序码" }).click();

  await expect(
    page.getByRole("heading", { name: "打开微信小程序" }),
  ).toBeVisible();
  await expect(page.getByAltText("SBTI 微信小程序码")).toBeVisible();
  await expect(page.getByRole("link", { name: "下载小程序码" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Close dialog" })).toBeVisible();
  await expect(page.getByText("关闭", { exact: true })).toHaveCount(0);
});

test("shows the auto redirect screen on mobile devices", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/tests/sbti");

  await expect(
    page.getByRole("heading", { name: "正在跳转到微信小程序..." }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "取消跳转，继续浏览网页" }),
  ).toBeVisible();
});

test("uses the configured mini program url in the dialog", async ({ page }) => {
  await page.goto("/tests/sbti?disableMiniProgramRedirect=1");
  await page.getByRole("button", { name: "查看小程序码" }).click();

  await expect(
    page.getByRole("link", { name: "打开微信小程序" }),
  ).toHaveAttribute("href", "https://wxaurl.cn/MG3YoSpo23s");
});

test("hides mini program entry content inside the mini program webview", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, "__wxjs_environment", {
      configurable: true,
      value: "miniprogram",
    });
  });

  await page.goto("/tests/sbti");

  await expect(page.getByRole("button", { name: "开始测试" })).toBeVisible();
  await expect(page.getByRole("button", { name: "查看小程序码" })).toHaveCount(0);
  await expect(
    page.getByText("如需在微信内体验，可打开 SBTI 微信小程序 并通过小程序码进入。"),
  ).toHaveCount(0);
});
