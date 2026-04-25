import { describe, expect, it, vi } from "vitest";

import {
  buildResultShareMeta,
  copyTextToClipboard,
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
    expect(meta.summary).toBe("匹配度 100% · 精准命中 15/15 维");
    expect(meta.title).toBe("我的SBTI 人格测试结果：CTRL（拿捏者）");
    expect(meta.text).toContain("CTRL（拿捏者）");
    expect(meta.text).toContain("匹配度 100%");
  });

  it("shortens overly long share summaries before building share text", () => {
    const meta = buildResultShareMeta({
      code: "SDTI",
      label: "阅人无数型",
      quizName: "SDTI 人格测评",
      slug: "sdti",
      summary:
        "这是一段明显超过分享图安全长度的超长描述，用来验证摘要截断行为和省略号结尾，并且继续补充一句，确保长度一定超过安全阈值。",
    });

    expect(meta.summary).toMatch(/…$/);
    expect(meta.summary.length).toBeLessThanOrEqual(48);
    expect(meta.text).toContain(meta.summary);
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

  it("copies share text through the Clipboard API when available", async () => {
    const writeText = vi.fn(async () => {});

    vi.stubGlobal("navigator", {
      clipboard: {
        writeText,
      },
    });

    await expect(copyTextToClipboard("share text")).resolves.toBe(true);
    expect(writeText).toHaveBeenCalledWith("share text");
  });

  it("falls back to execCommand copy when Clipboard API is unavailable", async () => {
    const select = vi.fn();
    const remove = vi.fn();
    const execCommand = vi.fn(() => true);
    const body = {
      appendChild: vi.fn(),
      removeChild: vi.fn(),
    };

    vi.stubGlobal("navigator", {});
    vi.stubGlobal("document", {
      body,
      createElement: vi.fn(() => ({
        remove,
        select,
        setAttribute: vi.fn(),
        style: {},
        value: "",
      })),
      execCommand,
    });

    await expect(copyTextToClipboard("fallback text")).resolves.toBe(true);
    expect(execCommand).toHaveBeenCalledWith("copy");
    expect(select).toHaveBeenCalledTimes(1);
    expect(remove).toHaveBeenCalledTimes(1);
  });
});
