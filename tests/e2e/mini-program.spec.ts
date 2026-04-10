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
