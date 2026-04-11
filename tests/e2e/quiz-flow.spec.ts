import { expect, test } from "@playwright/test";

test("shows the sbti quiz immediately on page load", async ({ page }) => {
  await page.goto("/tests/sbti");
  await expect(page).toHaveTitle("SBTI 人格测试｜SBTI 测评入口｜SBTI 结果说明");
  await expect(
    page.getByText("保留题目流程、隐藏题与结果机制的本地版本。先做题，再等系统审判。"),
  ).toHaveCount(0);

  await expect(page.getByText(/第 1 题/)).toBeVisible();
  await expect(page.getByText("0 / 31")).toBeVisible();
  await expect(page).toHaveURL(/\/tests\/sbti\/?$/);
});

test("shows a visible sbti answer-rich panel without hiding it from users", async ({
  page,
}) => {
  await page.goto("/tests/sbti");

  const seoContent = page.getByTestId("sbti-answer-rich-panel");

  await expect(seoContent).toHaveCount(1);
  await expect(seoContent).toContainText("SBTI 人格测试是什么");
  await expect(seoContent).toContainText("Science Based Targets initiative");
  await expect(seoContent).toBeVisible();
  await expect(page.getByText(/第 1 题/)).toBeVisible();
});

test("reveals drink follow-up question when choosing 饮酒", async ({ page }) => {
  await page.goto("/tests/sbti");

  await expect(page.getByText("您平时有什么爱好？")).toBeVisible();
  await page.getByLabel("饮酒").check();

  await expect(page.getByText("您对饮酒的态度是？")).toBeVisible();
  await expect(page.getByText(/\/ 32/)).toBeVisible();
});
