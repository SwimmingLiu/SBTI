import path from "node:path";
import { spawn } from "node:child_process";

import { chromium } from "playwright";

import { captureScenarios, waitForServer } from "./capture-utils";

const PORT = 3001;
const LOCAL_URL = `http://127.0.0.1:${PORT}`;

async function run() {
  const command = process.platform === "win32" ? "npm.cmd" : "npm";
  const server = spawn(
    command,
    ["run", "dev", "--", "--hostname", "127.0.0.1", "--port", String(PORT)],
    {
      cwd: process.cwd(),
      stdio: "ignore",
    },
  );

  try {
    await waitForServer(LOCAL_URL);

    const browser = await chromium.launch();
    try {
      const page = await browser.newPage({
        viewport: { width: 1440, height: 1800 },
      });

      await captureScenarios(
        page,
        LOCAL_URL,
        path.join(process.cwd(), "research/local/results"),
      );
    } finally {
      await browser.close();
    }
  } finally {
    server.kill("SIGTERM");
  }
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
