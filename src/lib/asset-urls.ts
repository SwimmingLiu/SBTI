const defaultOssAssetBaseUrl =
  "https://sbti-orangemust.oss-cn-beijing.aliyuncs.com/assets";
const assetBaseUrl =
  process.env.NEXT_PUBLIC_ASSET_BASE_URL?.trim() || defaultOssAssetBaseUrl;
const preferLocalAssets = process.env.NEXT_PUBLIC_USE_LOCAL_ASSETS === "1";

export function toAssetUrl(assetPath: string) {
  const normalizedPath = assetPath.replace(/^\/+/, "").replace(/^assets\//, "");
  if (preferLocalAssets) {
    return `/assets/${normalizedPath}`;
  }

  return `${assetBaseUrl}/${normalizedPath}`;
}

export const sbtiPreviewImageUrl = toAssetUrl("original/sbti/CTRL.png");
export const shareQrCodeUrl = toAssetUrl("mini-program/qrcode.png");
export const shareQrPlaceholderUrl = toAssetUrl("mini-program/qrcode-placeholder.svg");
