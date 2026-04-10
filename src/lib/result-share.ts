type ResultShareMetaInput = {
  badge: string;
  cn: string;
  code: string;
};

export type ResultShareMeta = {
  fileName: string;
  text: string;
  title: string;
};

export function buildResultShareMeta({
  badge,
  cn,
  code,
}: ResultShareMetaInput): ResultShareMeta {
  return {
    fileName: `sbti-${code}.png`,
    text: `我测出来的 SBTI 结果是 ${code}（${cn}），${badge}。快来看看你的结果。`,
    title: `我的 SBTI 结果：${code}（${cn}）`,
  };
}

export function isNativeShareSupported() {
  return typeof navigator !== "undefined" && typeof navigator.share === "function";
}

export function isWechatBrowser() {
  if (typeof navigator === "undefined") {
    return false;
  }

  return navigator.userAgent.toLowerCase().includes("micromessenger");
}

export function dataUrlToBlob(dataUrl: string) {
  const [header, payload] = dataUrl.split(",");
  const mime = header.match(/data:(.*?);base64/)?.[1] ?? "image/png";
  const binary = atob(payload);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }

  return new Blob([bytes], { type: mime });
}
