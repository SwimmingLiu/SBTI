import path from "node:path";

import { chromium } from "playwright";

import { captureScenarios } from "./capture-utils";

async function run() {
  const browser = await chromium.launch();

  try {
    const page = await browser.newPage({
      viewport: { width: 1440, height: 1800 },
    });

    await captureScenarios(
      page,
      "https://shenxianovo.com/SBTI.html",
      path.join(process.cwd(), "research/original/results"),
    );
  } finally {
    await browser.close();
  }
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
