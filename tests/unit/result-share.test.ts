import { describe, expect, it } from "vitest";

import { buildResultShareMeta } from "@/lib/result-share";

describe("result share helpers", () => {
  it("builds a readable share payload from the result type and badge", () => {
    const meta = buildResultShareMeta({
      code: "CTRL",
      label: "CTRL（拿捏者）",
      quizName: "SBTI 人格测试",
      slug: "sbti",
      summary: "匹配度 100% · 精准命中 15/15 维",
    });

    expect(meta.fileName).toBe("sbti-CTRL.png");
    expect(meta.title).toBe("我的SBTI 人格测试结果：CTRL（拿捏者）");
    expect(meta.text).toContain("CTRL（拿捏者）");
    expect(meta.text).toContain("匹配度 100%");
  });
});
