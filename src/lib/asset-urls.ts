const defaultOssAssetBaseUrl =
  "https://sbti-orangemust.oss-cn-beijing.aliyuncs.com/assets";
const assetBaseUrl =
  (process.env.NEXT_PUBLIC_ASSET_BASE_URL?.trim() || defaultOssAssetBaseUrl).replace(
    /\/+$/,
    "",
  );

export function toAssetUrl(assetPath: string) {
  const normalizedPath = assetPath.replace(/^\/+/, "").replace(/^assets\//, "");
  return `${assetBaseUrl}/${normalizedPath}`;
}

export const sbtiPreviewImageUrl = toAssetUrl("original/sbti/CTRL.png");
export const shareQrCodeUrl = toAssetUrl("mini-program/qrcode.png");
export const shareQrPlaceholderUrl = toAssetUrl("mini-program/qrcode-placeholder.svg");
