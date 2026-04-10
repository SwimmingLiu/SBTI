import { describe, expect, it } from "vitest";

import { buildResultShareMeta } from "@/lib/result-share";

describe("result share helpers", () => {
  it("builds a readable share payload from the result type and badge", () => {
    const meta = buildResultShareMeta({
      badge: "匹配度 100% · 精准命中 15/15 维",
      code: "CTRL",
      cn: "拿捏者",
    });

    expect(meta.fileName).toBe("sbti-CTRL.png");
    expect(meta.title).toBe("我的 SBTI 结果：CTRL（拿捏者）");
    expect(meta.text).toContain("CTRL（拿捏者）");
    expect(meta.text).toContain("匹配度 100%");
  });
});
