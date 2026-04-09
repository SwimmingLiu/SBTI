import fs from "node:fs/promises";
import path from "node:path";

import type { Page } from "playwright";

import { buildResultScenarios } from "../src/lib/sbti-scenarios";

export type CaptureSummary = {
  badge: string | null;
  code: string;
  desc: string | null;
  dimensions: Array<{ name: string | null; score: string | null }>;
  imageSrc: string | null;
  posterCaption: string | null;
  typeName: string | null;
  typeSub: string | null;
};

export function sortAnswerEntries(answers: Record<string, number>) {
  return Object.entries(answers).sort(([left], [right]) => {
    if (left === "drink_gate_q1") return -1;
    if (right === "drink_gate_q1") return 1;
    if (left === "drink_gate_q2") return 1;
    if (right === "drink_gate_q2") return -1;
    return left.localeCompare(right, undefined, { numeric: true });
  });
}

export async function fillScenarioAnswers(
  page: Page,
  answers: Record<string, number>,
) {
  for (const [questionId, value] of sortAnswerEntries(answers)) {
    await page.locator(`input[name="${questionId}"][value="${value}"]`).check();
  }
}

export async function extractResult(page: Page) {
  return page.evaluate(() => {
    const dimensionNodes = Array.from(document.querySelectorAll("#dimList .dim-item"));

    return {
      badge: document.querySelector("#matchBadge")?.textContent?.trim() ?? null,
      desc: document.querySelector("#resultDesc")?.textContent?.trim() ?? null,
      dimensions: dimensionNodes.map((node) => ({
        name:
          node.querySelector(".dim-item-name")?.textContent?.trim() ?? null,
        score:
          node.querySelector(".dim-item-score")?.textContent?.trim() ?? null,
      })),
      imageSrc:
        document.querySelector<HTMLImageElement>("#posterImage")?.getAttribute(
          "src",
        ) ?? null,
      posterCaption:
        document.querySelector("#posterCaption")?.textContent?.trim() ?? null,
      typeName:
        document.querySelector("#resultTypeName")?.textContent?.trim() ?? null,
      typeSub:
        document.querySelector("#resultTypeSub")?.textContent?.trim() ?? null,
    };
  }) as Promise<Omit<CaptureSummary, "code">>;
}

export async function captureScenarios(page: Page, url: string, outputDir: string) {
  await fs.mkdir(outputDir, { recursive: true });

  const summaries: CaptureSummary[] = [];

  for (const scenario of buildResultScenarios()) {
    await page.goto(url, { waitUntil: "domcontentloaded" });
    await page.waitForLoadState("networkidle");
    await page.getByRole("button", { name: "开始测试" }).click();
    await page.locator("#questionList").waitFor();
    await page.locator('input[name="drink_gate_q1"]').first().waitFor();
    await fillScenarioAnswers(page, scenario.answers);
    await page.locator("#submitBtn").click();
    await page.locator("#resultTypeName").waitFor();

    const extracted = await extractResult(page);
    const capture = { code: scenario.code, ...extracted };
    summaries.push(capture);

    await page.screenshot({
      fullPage: true,
      path: path.join(outputDir, `${scenario.code}.png`),
    });
    await fs.writeFile(
      path.join(outputDir, `${scenario.code}.json`),
      `${JSON.stringify(capture, null, 2)}\n`,
      "utf8",
    );
  }

  await fs.writeFile(
    path.join(outputDir, "index.json"),
    `${JSON.stringify(summaries, null, 2)}\n`,
    "utf8",
  );

  return summaries;
}

export async function waitForServer(url: string, attempts = 80) {
  for (let index = 0; index < attempts; index += 1) {
    try {
      const response = await fetch(url);
      if (response.ok) {
        return;
      }
    } catch {
      // ignore and retry
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  throw new Error(`Timed out waiting for local server at ${url}`);
}
