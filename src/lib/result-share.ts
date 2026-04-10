type ResultShareMetaInput = {
  code: string;
  label: string;
  quizName: string;
  slug: string;
  summary: string;
};

export type ResultShareMeta = {
  fileName: string;
  text: string;
  title: string;
};

export function buildResultShareMeta({
  code,
  label,
  quizName,
  slug,
  summary,
}: ResultShareMetaInput): ResultShareMeta {
  return {
    fileName: `${slug}-${code}.png`,
    text: `我测出来的${quizName}结果是 ${label}，${summary}。快来看看你的结果。`,
    title: `我的${quizName}结果：${label}`,
  };
}

export const shareQrCodeUrl = "/assets/mini-program/qrcode.png";

export async function waitForRenderableImages(container: HTMLElement | null) {
  if (!container) {
    return;
  }

  const images = Array.from(container.querySelectorAll("img"));
  await Promise.all(
    images.map(
      (image) =>
        new Promise<void>((resolve) => {
          if (image.complete && image.naturalWidth > 0) {
            resolve();
            return;
          }

          image.addEventListener("load", () => resolve(), { once: true });
          image.addEventListener("error", () => resolve(), { once: true });
        }),
    ),
  );
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
