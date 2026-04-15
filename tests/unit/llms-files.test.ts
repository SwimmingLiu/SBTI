import fs from "node:fs";
import path from "node:path";

import { describe, expect, test } from "vitest";

const projectRoot = path.resolve(__dirname, "../..");

function readPublicFile(fileName: string) {
  return fs.readFileSync(path.join(projectRoot, "public", fileName), "utf8");
}

describe("llms discovery files", () => {
  test("llms.txt and llms-full.txt describe the real routes", () => {
    const llms = readPublicFile("llms.txt");
    const llmsFull = readPublicFile("llms-full.txt");

    expect(llms).toContain("/tests/sbti");
    expect(llms).toContain("/tests/sdti");
    expect(llms).toContain("/tests/herti");
    expect(llmsFull).toContain("SBTI 和 SBTi");
    expect(llmsFull).toContain("首页");
    expect(llmsFull).toContain("FAQ");
    expect(llmsFull).not.toContain("FWTI");
  });
});
