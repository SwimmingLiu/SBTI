import fs from "node:fs";
import path from "node:path";

import { describe, expect, test } from "vitest";

const projectRoot = path.resolve(__dirname, "../..");

function readPublicFile(fileName: string) {
  return fs.readFileSync(path.join(projectRoot, "public", fileName), "utf8");
}

function readPublicFileBytes(fileName: string) {
  return fs.readFileSync(path.join(projectRoot, "public", fileName));
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

  test("llms discovery files start with a UTF-8 BOM for static text/plain hosting", () => {
    const llmsBytes = readPublicFileBytes("llms.txt");
    const llmsFullBytes = readPublicFileBytes("llms-full.txt");

    expect(Array.from(llmsBytes.subarray(0, 3))).toEqual([0xef, 0xbb, 0xbf]);
    expect(Array.from(llmsFullBytes.subarray(0, 3))).toEqual([0xef, 0xbb, 0xbf]);
  });
});
