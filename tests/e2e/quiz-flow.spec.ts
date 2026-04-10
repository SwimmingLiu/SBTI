import { expect, test } from "@playwright/test";

test("starts the quiz from intro screen", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle("SBTI 人格测试｜SBTI 测评｜SBTI 官网");

  await page.getByRole("button", { name: "开始测试" }).click();

  await expect(page).toHaveURL(/screen=test/);
  await expect(page.getByText(/第 1 题/)).toBeVisible();
  await expect(page.getByText("0 / 31")).toBeVisible();

  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
  await expect(page.getByRole("button", { name: "开始测试" })).toBeVisible();
});

test("reveals drink follow-up question when choosing 饮酒", async ({ page }) => {
  await page.goto("/");

  await page.getByRole("button", { name: "开始测试" }).click();

  await expect(page.getByText("您平时有什么爱好？")).toBeVisible();
  await page.getByLabel("饮酒").check();

  await expect(page.getByText("您对饮酒的态度是？")).toBeVisible();
  await expect(page.getByText(/\/ 32/)).toBeVisible();
});
