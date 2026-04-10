import { expect, test } from "@playwright/test";

test("shows multiple test entries on the home page and routes into sbti", async ({
  page,
}) => {
  await page.goto("/");

  await expect(page).toHaveTitle("人格测试题库｜SBTI · SDTI · HERTI");
  await expect(page.getByRole("heading", { name: "人格测试题库" })).toBeVisible();
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
