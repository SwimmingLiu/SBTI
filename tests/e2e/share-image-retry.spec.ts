import { expect, test } from "@playwright/test";

import { getHertiScenario } from "@/features/herti/data";
import { shareQrCodeUrl } from "@/lib/asset-urls";

test("retries the share watermark asset before freezing the preview image", async ({
  page,
}) => {
  const scenario = getHertiScenario("WAVE");

  if (!scenario) {
    throw new Error("Missing HERTI scenario: WAVE");
  }

  let qrRequestCount = 0;

  await page.route(`${shareQrCodeUrl}*`, async (route) => {
    qrRequestCount += 1;

    if (qrRequestCount === 1) {
      await route.abort("failed");
      return;
    }

    await route.continue();
  });

  await page.goto("/tests/herti");
  await page.getByRole("button", { name: "开 始 测 试" }).click();

  for (let index = 0; index < scenario.answers.length; index += 1) {
    await page
      .locator(
        `[data-question-index="${index}"][data-option-index="${scenario.answers[index]}"]`,
      )
      .click();
  }

  await page.getByRole("button", { name: "分 享 结 果" }).click();

  const shareDialog = page.getByRole("dialog", { name: "分享这张结果图" });
  await expect(shareDialog).toBeVisible();
  await expect
    .poll(() => qrRequestCount, {
      message: "share watermark image should be retried after the first load fails",
    })
    .toBeGreaterThanOrEqual(2);
  await expect
    .poll(async () => shareDialog.getByAltText("WAVE分享预览图").count())
    .toBe(1);
});
