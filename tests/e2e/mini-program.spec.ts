import { expect, test } from "@playwright/test";

test("opens the mini program code dialog from the intro screen", async ({
  page,
}) => {
  await page.goto("/");

  await page.getByRole("button", { name: "查看小程序码" }).click();

  await expect(
    page.getByRole("heading", { name: "打开微信小程序" }),
  ).toBeVisible();
  await expect(page.getByAltText("SBTI 微信小程序码")).toBeVisible();
  await expect(page.getByRole("link", { name: "下载小程序码" })).toBeVisible();
});

test("shows the auto redirect screen on mobile devices", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  await expect(page.getByText("正在跳转到微信小程序...")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "取消跳转，继续浏览网页" }),
  ).toBeVisible();
});
