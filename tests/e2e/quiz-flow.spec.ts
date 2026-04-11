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

test("keeps sbti seo content hidden from users while leaving it in the DOM", async ({
  page,
}) => {
  await page.goto("/tests/sbti");

  const seoContent = page.locator("[data-seo-content]");

  await expect(seoContent).toHaveCount(1);
  await expect(seoContent).toContainText("SBTI 人格测试是什么");
  await expect(seoContent).toContainText("Science Based Targets initiative");

  const seoStyle = await seoContent.evaluate((node) => {
    const style = window.getComputedStyle(node);

    return {
      clipPath: style.clipPath,
      height: style.height,
      overflow: style.overflow,
      position: style.position,
      width: style.width,
    };
  });

  expect(seoStyle.position).toBe("absolute");
  expect(seoStyle.overflow).toBe("hidden");
  expect(seoStyle.clipPath).not.toBe("none");
  expect(seoStyle.width).toBe("1px");
  expect(seoStyle.height).toBe("1px");

  const ariaHidden = await seoContent.getAttribute("aria-hidden");
  expect(ariaHidden).toBeNull();
  await expect(page.getByText(/第 1 题/)).toBeVisible();
});

test("reveals drink follow-up question when choosing 饮酒", async ({ page }) => {
  await page.goto("/tests/sbti");

  await expect(page.getByText("您平时有什么爱好？")).toBeVisible();
  await page.getByLabel("饮酒").check();

  await expect(page.getByText("您对饮酒的态度是？")).toBeVisible();
  await expect(page.getByText(/\/ 32/)).toBeVisible();
});
