import { expect, test, type Page } from "@playwright/test";

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

test("falls back to image plus copy actions inside mini program webviews", async ({
  page,
}) => {
  const answers = buildAnswersForPattern("HHH-HMH-MHH-HHH-MHM");
  let signatureRequestCount = 0;

  await page.addInitScript(() => {
    Object.defineProperty(window.navigator, "userAgent", {
      configurable: true,
      get() {
        return "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.53 miniProgram/wx1234567890";
      },
    });

    Object.defineProperty(window, "__wxjs_environment", {
      configurable: true,
      value: "miniprogram",
    });

    const calls = {
      clipboardWrites: [] as Array<string>,
      config: [] as Array<Record<string, unknown>>,
      postMessage: [] as Array<Record<string, unknown>>,
    };

    Object.defineProperty(window.navigator, "clipboard", {
      configurable: true,
      value: {
        async writeText(value: string) {
          calls.clipboardWrites.push(value);
        },
      },
    });

    Object.assign(window, {
      __wxShareCalls: calls,
      wx: {
        config(payload: Record<string, unknown>) {
          calls.config.push(payload);
        },
        miniProgram: {
          postMessage(payload: Record<string, unknown>) {
            calls.postMessage.push(payload);
          },
        },
      },
    });
  });

  await page.route("**/common/wx/oa/signature", async (route) => {
    signatureRequestCount += 1;
    await route.abort();
  });

  await page.goto("/tests/sbti");
  const origin = new URL(page.url()).origin;

  for (const question of questions) {
    const selectedValue = answers[question.id];
    await answerQuestion(page, question.id, selectedValue);
  }

  await answerQuestion(page, "drink_gate_q1", 2);
  await page.evaluate(() => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: "auto" });
  });
  await page.getByRole("button", { name: "提交并查看结果" }).click();

  await expect(page).toHaveURL(/screen=result/);
  await page.getByRole("button", { name: "分享结果" }).click();

  const shareDialog = page.getByRole("dialog", { name: "分享这张结果图" });
  await expect(shareDialog).toBeVisible();
  await expect(
    shareDialog.getByText(
      "当前在微信小程序内，不能直接调起微信卡片分享。可长按预览图保存，或复制链接和文案后手动转发。",
    ),
  ).toBeVisible();
  await expect(
    shareDialog.getByRole("button", { name: "复制分享文案" }),
  ).toBeVisible();
  await expect(
    shareDialog.getByRole("button", { name: "复制结果链接" }),
  ).toBeVisible();
  await expect(
    shareDialog.getByRole("button", { name: "长按预览图保存" }),
  ).toBeVisible();

  await shareDialog.getByRole("button", { name: "复制分享文案" }).click();
  await shareDialog.getByRole("button", { name: "复制结果链接" }).click();

  const wxCalls = await page.evaluate(() => {
    return ((window as unknown) as Window & {
      __wxShareCalls: {
        clipboardWrites: string[];
        config: Array<Record<string, unknown>>;
        postMessage: Array<Record<string, unknown>>;
      };
    }).__wxShareCalls;
  });

  expect(signatureRequestCount).toBe(0);
  expect(wxCalls.config).toHaveLength(0);
  expect(wxCalls.postMessage).toHaveLength(0);
  expect(wxCalls.clipboardWrites[0]).toContain("CTRL（拿捏者）");
  expect(wxCalls.clipboardWrites[0]).toContain("快来看看你的结果");
  expect(wxCalls.clipboardWrites[1]).toBe(`${origin}/tests/sbti/`);
});
