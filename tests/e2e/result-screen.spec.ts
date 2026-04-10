import { expect, type Page, test } from "@playwright/test";

import { dimensionOrder, questions } from "@/lib/sbti-data";

const questionsByDimension = Object.groupBy(questions, (question) => question.dim);

function buildAnswersForPattern(pattern: string) {
  const answers: Record<string, number> = {};
  const levels = pattern.replaceAll("-", "").split("");

  dimensionOrder.forEach((dimension, index) => {
    const dimensionQuestions = questionsByDimension[dimension];
    const level = levels[index];
    const pair =
      level === "L" ? [1, 1] : level === "M" ? [2, 2] : [3, 3];

    if (!dimensionQuestions || dimensionQuestions.length !== 2) {
      throw new Error(`Unexpected dimension question count for ${dimension}`);
    }

    answers[dimensionQuestions[0].id] = pair[0];
    answers[dimensionQuestions[1].id] = pair[1];
  });

  answers.drink_gate_q1 = 2;

  return answers;
}

async function answerQuestion(page: Page, questionId: string, value: number) {
  await page.locator(`input[name="${questionId}"][value="${value}"]`).check();
}

test("submits a full quiz and renders the result screen", async ({ page }) => {
  const answers = buildAnswersForPattern("HHH-HMH-MHH-HHH-MHM");

  await page.goto("/");
  await page.getByRole("button", { name: "开始测试" }).click();

  for (const question of questions) {
    const selectedValue = answers[question.id];
    await answerQuestion(page, question.id, selectedValue);
  }

  await answerQuestion(page, "drink_gate_q1", 2);
  await page.evaluate(() => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "auto" });
  });
  await page.getByRole("button", { name: "提交并查看结果" }).click();

  await expect(page.getByText("CTRL（拿捏者）")).toBeVisible();
  await expect(page.getByText("匹配度 100%")).toBeVisible();
  await expect(page.getByText("该人格的简单解读")).toBeVisible();
  await expect(page.getByText("十五维度评分")).toBeVisible();
  await expect(page.getByText("友情提示")).toBeVisible();
  await expect.poll(async () => {
    return page.evaluate(() => Math.round(window.scrollY));
  }).toBeLessThan(80);
  await expect(page.getByRole("button", { name: "分享结果" })).toBeVisible();
  await page.getByRole("button", { name: "分享结果" }).click();
  const shareDialog = page.getByRole("dialog", { name: "分享这张结果图" });
  await expect(shareDialog).toBeVisible();
  await expect(
    shareDialog.getByRole("button", { name: "系统分享" }),
  ).toBeVisible();
  await expect(
    shareDialog.getByRole("button", { name: "保存图片" }),
  ).toBeVisible();
  await expect(
    shareDialog.getByRole("button", { name: "复制文案" }),
  ).toBeVisible();
});
