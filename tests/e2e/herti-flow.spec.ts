import { expect, type Page, test } from "@playwright/test";

import { getHertiScenario } from "@/features/herti/data";

async function answerScenario(page: Page, answers: number[]) {
  for (let index = 0; index < answers.length; index += 1) {
    await page
      .locator(
        `[data-question-index="${index}"][data-option-index="${answers[index]}"]`,
      )
      .click();
  }
}

test("opens herti from the home page and lands on a literary result card", async ({
  page,
}) => {
  const scenario = getHertiScenario("WAVE");

  if (!scenario) {
    throw new Error("Missing HERTI scenario: WAVE");
  }

  await page.goto("/");
  await page.getByRole("link", { name: "进入 HERTI" }).click();

  await expect(page).toHaveURL(/\/tests\/herti\/?$/);
  await expect(
    page.getByRole("heading", { name: "HERTI", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "开 始 测 试" }).click();
  await answerScenario(page, scenario.answers);

  await expect(page.locator("#hertiPrimaryCode")).toHaveText("WAVE");
  await expect(page.locator("#hertiPrimaryCn")).toHaveText("浪");
  await expect(page.locator("#hertiEpigraph")).toContainText("一间自己的房间");
});

test("renders mirror and opposite cards for herti results", async ({ page }) => {
  const scenario = getHertiScenario("GAZE");

  if (!scenario) {
    throw new Error("Missing HERTI scenario: GAZE");
  }

  await page.goto("/tests/herti");
  await page.getByRole("button", { name: "开 始 测 试" }).click();
  await answerScenario(page, scenario.answers);

  await expect(page.locator("#hertiPrimaryCode")).toHaveText("GAZE");
  await expect(page.locator("#hertiRelations")).toContainText("your mirror");
  await expect(page.locator("#hertiRelations")).toContainText("your opposite");
  await page.getByRole("button", { name: "分 享 结 果" }).click();
  await expect(page.getByRole("dialog", { name: "分享这张结果图" })).toBeVisible();
  await expect(page.getByText("小橙有门")).toBeVisible();
});
