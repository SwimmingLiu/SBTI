import { expect, test, type Locator, type Page } from "@playwright/test";

import { getHertiScenario } from "@/features/herti/data";
import { getSdtiScenarioByCode } from "@/features/sdti/data";
import { dimensionOrder, questions } from "@/lib/sbti-data";

const questionsByDimension = Object.groupBy(questions, (question) => question.dim);

function buildSbtiAnswersForPattern(pattern: string) {
  const answers: Record<string, number> = {};
  const levels = pattern.replaceAll("-", "").split("");

  dimensionOrder.forEach((dimension, index) => {
    const dimensionQuestions = questionsByDimension[dimension];
    const level = levels[index];
    const pair = level === "L" ? [1, 1] : level === "M" ? [2, 2] : [3, 3];

    if (!dimensionQuestions || dimensionQuestions.length !== 2) {
      throw new Error(`Unexpected dimension question count for ${dimension}`);
    }

    answers[dimensionQuestions[0].id] = pair[0];
    answers[dimensionQuestions[1].id] = pair[1];
  });

  answers.drink_gate_q1 = 2;
  return answers;
}

async function disableMotion(page: Page) {
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation: none !important;
        transition: none !important;
        caret-color: transparent !important;
      }
      html {
        scroll-behavior: auto !important;
      }
    `,
  });
}

async function expectLocatorSnapshot(
  locator: Locator,
  name: string,
  options: Record<string, unknown> = {},
) {
  await expect(locator).toHaveScreenshot(name, {
    animations: "disabled",
    caret: "hide",
    scale: "device",
    ...options,
  });
}

test("home page visual baseline", async ({ page }) => {
  await page.goto("/");
  await disableMotion(page);

  await expectLocatorSnapshot(
    page.locator("main > section").first(),
    "home-library-shell.png",
    { maxDiffPixelRatio: 0.02 },
  );
});

test("sbti result and share dialog visual baseline", async ({ page }) => {
  const answers = buildSbtiAnswersForPattern("HHH-HMH-MHH-HHH-MHM");

  await page.goto("/tests/sbti");
  await disableMotion(page);

  for (const question of questions) {
    const selectedValue = answers[question.id];
    await page.locator(`input[name="${question.id}"][value="${selectedValue}"]`).check();
  }

  await page.locator(`input[name="drink_gate_q1"][value="2"]`).check();
  await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: "auto" }));
  await page.getByRole("button", { name: "提交并查看结果" }).click();

  await expectLocatorSnapshot(
    page.locator("section.w-full").first(),
    "sbti-result-screen.png",
  );

  await page.getByRole("button", { name: "分享结果" }).click();
  const shareDialog = page.getByRole("dialog", { name: "分享这张结果图" });
  await expect
    .poll(async () => shareDialog.getByAltText("CTRL（拿捏者）分享预览图").count())
    .toBe(1);

  await expectLocatorSnapshot(shareDialog, "sbti-share-dialog.png");
});

test("sdti result and share dialog visual baseline", async ({ page }) => {
  const scenario = getSdtiScenarioByCode("human-reader");

  if (!scenario) {
    throw new Error("Missing SDTI scenario: human-reader");
  }

  await page.goto("/tests/sdti");
  await disableMotion(page);

  for (const [questionNumber, optionKey] of Object.entries(scenario.answers)) {
    await page.locator(`[data-q="${questionNumber}"][data-opt="${optionKey}"]`).click();
  }

  await page.getByRole("button", { name: "提 交" }).click();

  await expectLocatorSnapshot(page.locator("#result"), "sdti-result-screen.png");

  await page.getByRole("button", { name: "分享结果" }).click();
  const shareDialog = page.getByRole("dialog", { name: "分享这张结果图" });
  await expect
    .poll(async () => shareDialog.getByAltText("阅人无数型分享预览图").count())
    .toBe(1);

  await expectLocatorSnapshot(shareDialog, "sdti-share-dialog.png");
});

test("herti result and share dialog visual baseline", async ({ page }) => {
  const scenario = getHertiScenario("WAVE");

  if (!scenario) {
    throw new Error("Missing HERTI scenario: WAVE");
  }

  await page.goto("/tests/herti");
  await disableMotion(page);
  await page.getByRole("button", { name: "开 始 测 试" }).click();

  for (let index = 0; index < scenario.answers.length; index += 1) {
    await page
      .locator(
        `[data-question-index="${index}"][data-option-index="${scenario.answers[index]}"]`,
      )
      .click();
  }

  await expectLocatorSnapshot(
    page.locator("section.min-h-screen > div").first(),
    "herti-result-screen.png",
  );

  await page.getByRole("button", { name: "分 享 结 果" }).click();
  const shareDialog = page.getByRole("dialog", { name: "分享这张结果图" });
  await expect
    .poll(async () => shareDialog.getByAltText("WAVE分享预览图").count())
    .toBe(1);

  await expectLocatorSnapshot(shareDialog, "herti-share-dialog.png");
});
