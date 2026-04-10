import fs from "node:fs/promises";
import path from "node:path";

import { chromium } from "playwright";

import { hertiScenarios } from "../src/features/herti/data";

type CaptureSummary = {
  code: string;
  epigraph: string | null;
  mirror: string | null;
  opposite: string | null;
  personaText: string[];
  primaryCn: string | null;
  primaryCode: string | null;
  soulText: string[];
  source: string | null;
};

async function run() {
  const outputDir = path.join(process.cwd(), "research/herti/results");
  await fs.mkdir(outputDir, { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage({
    viewport: { width: 1280, height: 2200 },
  });
  const captures: CaptureSummary[] = [];

  try {
    for (const scenario of hertiScenarios) {
      await page.goto("https://herti.netlify.app", { waitUntil: "domcontentloaded" });
      await page.waitForLoadState("networkidle");
      await page.getByRole("button", { name: "开 始 测 试" }).click();
      await page.locator(".option").first().waitFor();

      for (let index = 0; index < scenario.answers.length; index += 1) {
        await page.locator(".option").nth(scenario.answers[index]).click();
      }

      await page.locator(".hero-code").waitFor();

      const capture = await page.evaluate((code) => {
        const personaText = Array.from(
          document.querySelectorAll(".persona-text"),
        ).map((node) => node.textContent?.trim() ?? "");
        const soulText = Array.from(document.querySelectorAll(".soul-text")).map(
          (node) => node.textContent?.trim() ?? "",
        );
        const relationCodes = Array.from(
          document.querySelectorAll(".relation-code"),
        ).map((node) => node.textContent?.trim() ?? "");

        return {
          code,
          epigraph: document.querySelector(".epigraph")?.textContent?.trim() ?? null,
          mirror: relationCodes[0] ?? null,
          opposite: relationCodes[1] ?? null,
          personaText,
          primaryCn: document.querySelector(".hero-cn-name")?.textContent?.trim() ?? null,
          primaryCode: document.querySelector(".hero-code")?.textContent?.trim() ?? null,
          soulText,
          source: document.querySelector(".hero-meaning")?.textContent?.trim() ?? null,
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
