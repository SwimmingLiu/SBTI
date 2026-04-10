import { expect, test } from "@playwright/test";

test("shows the sbti quiz immediately on page load", async ({ page }) => {
  await page.goto("/tests/sbti");
  await expect(page).toHaveTitle("SBTI 人格测试｜SBTI 测评｜SBTI 官网");
  await expect(
    page.getByText("保留题目流程、隐藏题与结果机制的本地版本。先做题，再等系统审判。"),
  ).toHaveCount(0);

  await expect(page.getByText(/第 1 题/)).toBeVisible();
  await expect(page.getByText("0 / 31")).toBeVisible();
  await expect(page).toHaveURL(/\/tests\/sbti$/);
});

test("keeps seo content out of sight for users", async ({ page }) => {
  await page.goto("/tests/sbti");

  const seoContent = page.locator("[data-seo-content]");

  await expect(seoContent).toHaveCount(1);
  await expect(seoContent).toContainText("SBTI 人格测试是什么");
  await expect(seoContent).toContainText("SBTI 测试入口与流程");

  const seoStyle = await seoContent.evaluate((node) => {
    const style = window.getComputedStyle(node);

    return {
      clipPath: style.clipPath,
      height: style.height,
      overflow: style.overflow,
      pointerEvents: style.pointerEvents,
      position: style.position,
      width: style.width,
    };
  });

  expect(seoStyle.position).toBe("absolute");
  expect(seoStyle.overflow).toBe("hidden");
  expect(seoStyle.pointerEvents).toBe("none");
  expect(seoStyle.clipPath).not.toBe("none");
  expect(seoStyle.width).toBe("1px");
  expect(seoStyle.height).toBe("1px");
  await expect(page.getByText(/第 1 题/)).toBeVisible();
});

test("reveals drink follow-up question when choosing 饮酒", async ({ page }) => {
  await page.goto("/tests/sbti");

  await expect(page.getByText("您平时有什么爱好？")).toBeVisible();
  await page.getByLabel("饮酒").check();

  await expect(page.getByText("您对饮酒的态度是？")).toBeVisible();
  await expect(page.getByText(/\/ 32/)).toBeVisible();
});
