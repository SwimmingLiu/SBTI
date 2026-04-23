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

test("configures wechat share data for sbti result pages inside wechat", async ({
  page,
}) => {
  const answers = buildAnswersForPattern("HHH-HMH-MHH-HHH-MHM");
  let signatureRequestBody = "";

  await page.addInitScript(() => {
    Object.defineProperty(window.navigator, "userAgent", {
      configurable: true,
      get() {
        return "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 MicroMessenger/8.0.53";
      },
    });

    const readyCallbacks: Array<() => void> = [];
    const errorCallbacks: Array<(error: unknown) => void> = [];
    const calls = {
      config: [] as Array<Record<string, unknown>>,
      onMenuShareAppMessage: [] as Array<Record<string, unknown>>,
      onMenuShareTimeline: [] as Array<Record<string, unknown>>,
      updateAppMessageShareData: [] as Array<Record<string, unknown>>,
      updateTimelineShareData: [] as Array<Record<string, unknown>>,
    };

    Object.assign(window, {
      __wxShareCalls: calls,
      wx: {
        config(payload: Record<string, unknown>) {
          calls.config.push(payload);
          window.setTimeout(() => {
            for (const callback of readyCallbacks) {
              callback();
            }
          }, 0);
        },
        error(callback: (error: unknown) => void) {
          errorCallbacks.push(callback);
        },
        onMenuShareAppMessage(payload: Record<string, unknown>) {
          calls.onMenuShareAppMessage.push(payload);
        },
        onMenuShareTimeline(payload: Record<string, unknown>) {
          calls.onMenuShareTimeline.push(payload);
        },
        ready(callback: () => void) {
          readyCallbacks.push(callback);
        },
        updateAppMessageShareData(payload: Record<string, unknown>) {
          calls.updateAppMessageShareData.push(payload);
        },
        updateTimelineShareData(payload: Record<string, unknown>) {
          calls.updateTimelineShareData.push(payload);
        },
      },
    });
  });

  await page.route("**/common/wx/oa/signature", async (route) => {
    signatureRequestBody = route.request().postData() ?? "";

    await route.fulfill({
      body: JSON.stringify({
        data: {
          appId: "wx-test-appid",
          nonceStr: "nonce-value",
          signature: "signature-value",
          timestamp: 1745395200,
        },
      }),
      contentType: "application/json",
      status: 200,
    });
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
          __wxShareCalls?: { config: Array<unknown> };
        }).__wxShareCalls;
        return calls?.config.length ?? 0;
      });
    })
    .toBe(1);

  const wxCalls = await page.evaluate(() => {
    return (window as Window & {
      __wxShareCalls: Record<string, Array<Record<string, unknown>>>;
    }).__wxShareCalls;
  });

  expect(JSON.parse(signatureRequestBody)).toEqual({
    url: "http://127.0.0.1:3000/tests/sbti/",
  });
  expect(wxCalls.config[0]?.jsApiList).toEqual(
    expect.arrayContaining([
      "updateAppMessageShareData",
      "updateTimelineShareData",
      "onMenuShareAppMessage",
      "onMenuShareTimeline",
    ]),
  );
  expect(wxCalls.updateAppMessageShareData[0]).toMatchObject({
    desc: expect.stringContaining("人格画像"),
    imgUrl: expect.stringContaining("CTRL"),
    link: "http://127.0.0.1:3000/tests/sbti/",
    title: "我的SBTI 人格测试结果：CTRL（拿捏者）",
  });
  expect(wxCalls.updateTimelineShareData[0]).toMatchObject({
    imgUrl: expect.stringContaining("CTRL"),
    link: "http://127.0.0.1:3000/tests/sbti/",
    title: "我的SBTI 人格测试结果：CTRL（拿捏者）",
  });
});
