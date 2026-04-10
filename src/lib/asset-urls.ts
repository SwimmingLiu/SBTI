const ossAssetBaseUrl = "https://sbti-orangemust.oss-cn-beijing.aliyuncs.com/assets";

export function toOssAssetUrl(assetPath: string) {
  const normalizedPath = assetPath.replace(/^\/+/, "").replace(/^assets\//, "");
  return `${ossAssetBaseUrl}/${normalizedPath}`;
}

export const sbtiPreviewImageUrl = toOssAssetUrl("original/sbti/CTRL.png");
export const shareQrCodeUrl = toOssAssetUrl("mini-program/qrcode.png");
export const shareQrPlaceholderUrl = toOssAssetUrl("mini-program/qrcode-placeholder.svg");
