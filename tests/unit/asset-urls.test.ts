import { afterEach, describe, expect, it, vi } from "vitest";

const originalAssetBaseUrl = process.env.NEXT_PUBLIC_ASSET_BASE_URL;
const originalUseLocalAssets = process.env.NEXT_PUBLIC_USE_LOCAL_ASSETS;

async function loadAssetUrlsModule() {
  vi.resetModules();
  return import("@/lib/asset-urls");
}

afterEach(() => {
  if (originalAssetBaseUrl === undefined) {
    delete process.env.NEXT_PUBLIC_ASSET_BASE_URL;
  } else {
    process.env.NEXT_PUBLIC_ASSET_BASE_URL = originalAssetBaseUrl;
  }

  if (originalUseLocalAssets === undefined) {
    delete process.env.NEXT_PUBLIC_USE_LOCAL_ASSETS;
  } else {
    process.env.NEXT_PUBLIC_USE_LOCAL_ASSETS = originalUseLocalAssets;
  }
});

describe("asset url helpers", () => {
  it("uses the default OSS asset base url", async () => {
    delete process.env.NEXT_PUBLIC_ASSET_BASE_URL;
    delete process.env.NEXT_PUBLIC_USE_LOCAL_ASSETS;

    const { toAssetUrl } = await loadAssetUrlsModule();

    expect(toAssetUrl("original/sbti/CTRL.png")).toBe(
      "https://sbti-orangemust.oss-cn-beijing.aliyuncs.com/assets/original/sbti/CTRL.png",
    );
  });

  it("normalizes a custom asset base url that ends with a slash", async () => {
    process.env.NEXT_PUBLIC_ASSET_BASE_URL = "https://cdn.example.com/assets/";
    delete process.env.NEXT_PUBLIC_USE_LOCAL_ASSETS;

    const { toAssetUrl } = await loadAssetUrlsModule();

    expect(toAssetUrl("original/sbti/CTRL.png")).toBe(
      "https://cdn.example.com/assets/original/sbti/CTRL.png",
    );
  });

  it("can fall back to local assets explicitly", async () => {
    process.env.NEXT_PUBLIC_ASSET_BASE_URL = "https://cdn.example.com/assets";
    process.env.NEXT_PUBLIC_USE_LOCAL_ASSETS = "1";

    const { toAssetUrl } = await loadAssetUrlsModule();

    expect(toAssetUrl("original/sbti/CTRL.png")).toBe(
      "/assets/original/sbti/CTRL.png",
    );
  });
});
