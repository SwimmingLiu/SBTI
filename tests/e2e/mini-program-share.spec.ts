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

test("posts share metadata to the mini program host instead of using oa js-sdk", async ({
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
      config: [] as Array<Record<string, unknown>>,
      postMessage: [] as Array<Record<string, unknown>>,
    };

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

  await expect
    .poll(async () => {
      return page.evaluate(() => {
        const calls = (window as Window & {
          __wxShareCalls?: {
            postMessage: Array<Record<string, unknown>>;
          };
        }).__wxShareCalls;
        return calls?.postMessage.length ?? 0;
      });
    })
    .toBe(1);

  const wxCalls = await page.evaluate(() => {
    return (window as Window & {
      __wxShareCalls: Record<string, Array<Record<string, unknown>>>;
    }).__wxShareCalls;
  });

  expect(signatureRequestCount).toBe(0);
  expect(wxCalls.config).toHaveLength(0);
  expect(wxCalls.postMessage[0]).toMatchObject({
    data: {
      payload: {
        link: "http://127.0.0.1:3000/tests/sbti/",
        pageUrl: "http://127.0.0.1:3000/tests/sbti/?screen=result",
        title: "我的SBTI 人格测试结果：CTRL（拿捏者）",
      },
      type: "sbti-share",
    },
  });
});
