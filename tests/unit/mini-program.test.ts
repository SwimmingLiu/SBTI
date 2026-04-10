import { describe, expect, it } from "vitest";

import {
  getMiniProgramConfig,
  isWechat,
  isWechatMiniProgram,
  shouldAutoRedirectToMiniProgram,
} from "@/lib/mini-program";

describe("mini program helpers", () => {
  it("detects WeChat browser and mini program webview", () => {
    expect(
      isWechat(
        "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) MicroMessenger/8.0.0",
      ),
    ).toBe(true);
    expect(isWechat("Mozilla/5.0 Safari/604.1")).toBe(false);

    expect(
      isWechatMiniProgram({
        userAgent: "Mozilla/5.0 MicroMessenger/8.0.0 miniprogram",
      }),
    ).toBe(true);
    expect(
      isWechatMiniProgram({
        userAgent: "Mozilla/5.0 MicroMessenger/8.0.0",
        wxEnv: "miniprogram",
      }),
    ).toBe(true);
    expect(
      isWechatMiniProgram({
        userAgent: "Mozilla/5.0 MicroMessenger/8.0.0",
        hasMiniProgramApi: true,
      }),
    ).toBe(true);
    expect(
      isWechatMiniProgram({
        userAgent: "Mozilla/5.0 Safari/604.1",
      }),
    ).toBe(false);
  });

  it("redirects only when the environment really meets the conditions", () => {
    expect(
      shouldAutoRedirectToMiniProgram({
        isMobile: true,
        isInMiniProgram: false,
        miniProgramUrl: "https://example.com/wx-link",
        search: "",
      }),
    ).toBe(true);

    expect(
      shouldAutoRedirectToMiniProgram({
        isMobile: false,
        isInMiniProgram: false,
        miniProgramUrl: "https://example.com/wx-link",
        search: "",
      }),
    ).toBe(false);

    expect(
      shouldAutoRedirectToMiniProgram({
        isMobile: true,
        isInMiniProgram: true,
        miniProgramUrl: "https://example.com/wx-link",
        search: "",
      }),
    ).toBe(false);

    expect(
      shouldAutoRedirectToMiniProgram({
        isMobile: true,
        isInMiniProgram: false,
        miniProgramUrl: "",
        search: "",
      }),
    ).toBe(false);

    expect(
      shouldAutoRedirectToMiniProgram({
        isMobile: true,
        isInMiniProgram: false,
        miniProgramUrl: "https://example.com/wx-link",
        search: "?disableMiniProgramRedirect=1",
      }),
    ).toBe(false);
  });

  it("builds mini program config with safe defaults", () => {
    const config = getMiniProgramConfig();

    expect(config.appName).toBe("SBTI 微信小程序");
    expect(config.miniProgramUrl).toBe("https://wxaurl.cn/MG3YoSpo23s");
    expect(config.qrCodeUrl).toBe(
      "https://sbti-orangemust.oss-cn-beijing.aliyuncs.com/assets/mini-program/qrcode.png",
    );
  });
});
