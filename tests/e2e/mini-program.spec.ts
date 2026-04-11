import { expect, test } from "@playwright/test";

test("reveals the mini program qr preview only after clicking the download trigger", async ({
  page,
}) => {
  await page.goto("/?disableMiniProgramRedirect=1");

  await expect(page.getByText("微信小程序入口")).toBeVisible();
  await expect(page.getByAltText("SBTI 微信小程序二维码")).toHaveCount(0);
  await expect(
    page.getByRole("link", { name: "打开微信小程序" }),
  ).toHaveAttribute("href", "https://wxaurl.cn/MG3YoSpo23s");

  await page.getByRole("button", { name: "下载小程序码" }).click();

  await expect(page.getByAltText("SBTI 微信小程序二维码")).toBeVisible();
  await expect(page.getByRole("link", { name: "下载原图" })).toBeVisible();
});

test("shows the auto redirect screen on mobile devices", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "正在跳转到微信小程序..." }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: "取消跳转，继续浏览网页" }),
  ).toBeVisible();
});

test("uses the configured mini program url on the home page", async ({ page }) => {
  await page.goto("/?disableMiniProgramRedirect=1");
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

  await page.goto("/");

  await expect(
    page.getByRole("heading", { name: "人格测试题库", exact: true }),
  ).toBeVisible();
  await expect(page.getByText("微信小程序入口")).toHaveCount(0);
  await expect(
    page.getByRole("link", { name: "打开微信小程序" }),
  ).toHaveCount(0);
});
