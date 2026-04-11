import { describe, expect, it, vi } from "vitest";

import {
  buildResultShareMeta,
  retryAsync,
  waitForImageToRender,
} from "@/lib/result-share";

class FakeImage {
  complete = false;
  currentSrc = "";
  decode = vi.fn(async () => {});
  listeners = new Map<"error" | "load", Array<() => void>>([
    ["error", []],
    ["load", []],
  ]);
  naturalWidth = 0;
  src = "";

  addEventListener(type: "error" | "load", listener: () => void) {
    this.listeners.get(type)?.push(listener);
  }

  dispatch(type: "error" | "load") {
    for (const listener of this.listeners.get(type) ?? []) {
      listener();
    }
  }
}

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

  it("rejects broken share images instead of treating them as renderable", async () => {
    const image = new FakeImage();
    const pending = waitForImageToRender(image);

    image.complete = true;
    image.dispatch("error");

    await expect(pending).rejects.toThrow("Failed to load share image");
  });

  it("waits for decode before considering a share image renderable", async () => {
    const image = new FakeImage();
    const pending = waitForImageToRender(image);

    image.complete = true;
    image.naturalWidth = 128;
    image.dispatch("load");

    await expect(pending).resolves.toBeUndefined();
    expect(image.decode).toHaveBeenCalledTimes(1);
  });

  it("retries transient share image preparation failures", async () => {
    const run = vi
      .fn<() => Promise<string>>()
      .mockRejectedValueOnce(new Error("temporary network failure"))
      .mockResolvedValue("ok");

    await expect(
      retryAsync(run, {
        attempts: 2,
        delayMs: 0,
        taskName: "share image preload",
      }),
    ).resolves.toBe("ok");
    expect(run).toHaveBeenCalledTimes(2);
  });
});
