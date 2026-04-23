import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  buildWechatShareLink,
  normalizeWechatSignatureUrl,
  resolveWechatSignatureData,
  resolveWechatSignatureEndpoint,
} from "@/lib/wechat-share";

describe("wechat share helpers", () => {
  beforeEach(() => {
    vi.unstubAllEnvs();
  });

  it("strips hash fragments before requesting a signature", () => {
    expect(
      normalizeWechatSignatureUrl(
        "https://sbti.orangemust.com/tests/sbti?screen=result#share-dialog",
      ),
    ).toBe("https://sbti.orangemust.com/tests/sbti?screen=result");
  });

  it("builds a stable quiz entry link for shared cards", () => {
    expect(
      buildWechatShareLink({
        origin: "https://sbti.orangemust.com",
        slug: "herti",
      }),
    ).toBe("https://sbti.orangemust.com/tests/herti/");
  });

  it("prefers an explicit signature endpoint from env", () => {
    vi.stubEnv(
      "NEXT_PUBLIC_WECHAT_OA_SIGNATURE_ENDPOINT",
      "https://door.orangemust.com/common/wx/oa/signature",
    );

    expect(resolveWechatSignatureEndpoint()).toBe(
      "https://door.orangemust.com/common/wx/oa/signature",
    );
  });

  it("falls back to the default same-origin signature path", () => {
    expect(resolveWechatSignatureEndpoint()).toBe("/common/wx/oa/signature");
  });

  it("unwraps the backend data envelope into js-sdk signature fields", () => {
    expect(
      resolveWechatSignatureData({
        code: 0,
        data: {
          appId: "wx123",
          nonceStr: "nonce",
          signature: "signature",
          timestamp: 1745395200,
        },
      }),
    ).toEqual({
      appId: "wx123",
      nonceStr: "nonce",
      signature: "signature",
      timestamp: 1745395200,
    });
  });
});
