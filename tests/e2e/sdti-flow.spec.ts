import { expect, type Page, test } from "@playwright/test";

import { getSdtiScenarioByCode } from "@/features/sdti/data";

async function answerScenario(page: Page, answers: Record<string, string>) {
  for (const [questionNumber, optionKey] of Object.entries(answers)) {
    await page.locator(`[data-q="${questionNumber}"][data-opt="${optionKey}"]`).click();
  }
}

test("opens sdti from the home page and renders a regular result", async ({
  page,
}) => {
  const scenario = getSdtiScenarioByCode("human-reader");

  if (!scenario) {
    throw new Error("Missing SDTI scenario: human-reader");
  }

  await page.goto("/");
  await page.getByRole("link", { name: "进入 SDTI" }).click();

  await expect(page).toHaveURL(/\/tests\/sdti\/?$/);
  await expect(page.getByRole("heading", { name: "SDTI人格测试 v2.1" })).toBeVisible();
  await expect(page.getByText("@Egeria")).toHaveCount(0);

  await answerScenario(page, scenario.answers);
  await page.getByRole("button", { name: "提 交" }).click();

  await expect(page.locator("#result-type")).toHaveText("阅人无数型");
  await expect(page.locator("#result-desc")).toContainText("你看人只需要三秒");
  await expect(page.locator("#dimensions .dim-item")).toHaveCount(6);
});

test("reveals the hidden feminist ending in sdti", async ({ page }) => {
  const scenario = getSdtiScenarioByCode("feminist");

  if (!scenario) {
    throw new Error("Missing SDTI scenario: feminist");
  }

  await page.goto("/tests/sdti");
  await answerScenario(page, scenario.answers);
  await page.getByRole("button", { name: "提 交" }).click();

  await expect(page.locator("#result-type")).toHaveText(
    "Feminist · 女权主义者 🔓",
  );
  await expect(page.locator("#result-image")).toBeVisible();
  await expect(page.locator("#image-credit")).toContainText("小红书 @13读作一三");
  await page.getByRole("button", { name: "分享结果" }).click();
  await expect(page.getByRole("dialog", { name: "分享这张结果图" })).toBeVisible();
  await expect(page.getByText("小橙有门")).toBeVisible();
});
