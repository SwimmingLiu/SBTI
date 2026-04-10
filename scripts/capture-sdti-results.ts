import fs from "node:fs/promises";
import path from "node:path";

import { chromium } from "playwright";

import { sdtiScenarios } from "../src/features/sdti/data";

type CaptureSummary = {
  code: string;
  credit: string | null;
  dimensions: Array<{ label: string; score: string }>;
  imageSrc: string | null;
  name: string | null;
  note: string | null;
  resultDesc: string | null;
};

async function run() {
  const outputDir = path.join(process.cwd(), "research/sdti/results");
  await fs.mkdir(outputDir, { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1440, height: 2400 },
  });
  const captures: CaptureSummary[] = [];

  try {
    for (const scenario of sdtiScenarios) {
      await page.goto("https://fmnst.net", { waitUntil: "domcontentloaded" });
      await page.waitForLoadState("networkidle");

      for (const [questionNumber, optionKey] of Object.entries(scenario.answers)) {
        await page
          .locator(`.option[data-q="${questionNumber}"][data-opt="${optionKey}"]`)
          .click();
      }

      await page.locator("#submit-btn").click();
      await page.locator("#result.active").waitFor();

      const capture = await page.evaluate((code) => {
        const dimensionNodes = Array.from(
          document.querySelectorAll("#dimensions .dim-item"),
        );

        return {
          code,
          credit: document.querySelector("#image-credit")?.textContent?.trim() ?? null,
          dimensions: dimensionNodes.map((node) => ({
            label: node.querySelector(".dim-label")?.textContent?.trim() ?? "",
            score: node.querySelector(".dim-score")?.textContent?.trim() ?? "",
          })),
          imageSrc:
            document.querySelector<HTMLImageElement>("#result-image")?.getAttribute("src") ??
            null,
          name: document.querySelector("#result-type")?.textContent?.trim() ?? null,
          note: document.querySelector("#result-note")?.textContent?.trim() ?? null,
          resultDesc: document.querySelector("#result-desc")?.textContent?.trim() ?? null,
        };
      }, scenario.code);

      captures.push(capture);

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
      `${JSON.stringify(captures, null, 2)}\n`,
      "utf8",
    );
  } finally {
    await browser.close();
  }
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
