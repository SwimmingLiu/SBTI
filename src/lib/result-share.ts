type ResultShareMetaInput = {
  code: string;
  label: string;
  quizName: string;
  slug: string;
  summary: string;
};

export type ResultShareMeta = {
  fileName: string;
  summary: string;
  text: string;
  title: string;
};

function toShareCardSummary(summary: string, maxLength = 48) {
  const normalized = summary.replace(/\s+/g, " ").trim();

  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, maxLength - 1).trimEnd()}…`;
}

export function buildResultShareMeta({
  code,
  label,
  quizName,
  slug,
  summary,
}: ResultShareMetaInput): ResultShareMeta {
  const safeSummary = toShareCardSummary(summary);

  return {
    fileName: `${slug}-${code}.png`,
    summary: safeSummary,
    text: `我测出来的${quizName}结果是 ${label}，${safeSummary}。快来看看你的结果。`,
    title: `我的${quizName}结果：${label}`,
  };
}

type RenderableImageLike = {
  addEventListener: (
    type: "error" | "load",
    listener: () => void,
    options?: AddEventListenerOptions,
  ) => void;
  complete: boolean;
  currentSrc?: string;
  decode?: () => Promise<void>;
  naturalWidth: number;
  removeEventListener?: (
    type: "error" | "load",
    listener: () => void,
  ) => void;
  src: string;
};

type RetryOptions = {
  attempts?: number;
  delayMs?: number;
  taskName?: string;
};

type InlineShareImageOptions = {
  cacheBust?: boolean;
  retryDelayMs?: number;
  retryTimes?: number;
};

async function waitForImageDecode(image: RenderableImageLike) {
  if (typeof image.decode !== "function") {
    return;
  }

  try {
    await image.decode();
  } catch {
    // Some webviews throw during decode even though the pixels are already usable.
  }
}

function getShareImageError(image: RenderableImageLike) {
  return new Error(
    `Failed to load share image: ${image.currentSrc || image.src || "unknown"}`,
  );
}

function sleep(delayMs: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, delayMs);
  });
}

function withCacheBust(url: string) {
  if (/^data:|^blob:/.test(url)) {
    return url;
  }

  const separator = url.includes("?") ? "&" : "?";
  return `${url}${separator}shareBust=${Date.now()}`;
}

function blobToDataUrl(blob: Blob) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error ?? new Error("Failed to read share image blob"));
    reader.onloadend = () => resolve(String(reader.result));
    reader.readAsDataURL(blob);
  });
}

async function fetchImageAsDataUrl(url: string, cacheBust: boolean) {
  const response = await fetch(cacheBust ? withCacheBust(url) : url, {
    cache: "no-store",
    mode: "cors",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch share image: ${url}`);
  }

  return blobToDataUrl(await response.blob());
}

export async function retryAsync<T>(
  run: () => Promise<T>,
  {
    attempts = 2,
    delayMs = 120,
    taskName = "share image task",
  }: RetryOptions = {},
) {
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      return await run();
    } catch (error) {
      if (attempt === attempts) {
        throw error instanceof Error ? error : new Error(`${taskName} failed`);
      }

      await sleep(delayMs);
    }
  }

  throw new Error(`${taskName} failed`);
}

export async function waitForImageToRender(image: RenderableImageLike) {
  if (image.complete) {
    if (image.naturalWidth === 0) {
      throw getShareImageError(image);
    }

    await waitForImageDecode(image);
    return;
  }

  await new Promise<void>((resolve, reject) => {
    const cleanup = () => {
      image.removeEventListener?.("load", handleLoad);
      image.removeEventListener?.("error", handleError);
    };

    const handleLoad = () => {
      cleanup();

      if (image.naturalWidth === 0) {
        reject(getShareImageError(image));
        return;
      }

      void waitForImageDecode(image).then(() => resolve(), reject);
    };

    const handleError = () => {
      cleanup();
      reject(getShareImageError(image));
    };

    image.addEventListener("load", handleLoad, { once: true });
    image.addEventListener("error", handleError, { once: true });
  });
}

export async function waitForRenderableImages(container: HTMLElement | null) {
  if (!container) {
    return;
  }

  const images = Array.from(container.querySelectorAll("img"));
  await Promise.all(images.map((image) => waitForImageToRender(image)));
}

export async function inlineShareCardImages(
  container: HTMLElement | null,
  {
    cacheBust = true,
    retryDelayMs = 160,
    retryTimes = 2,
  }: InlineShareImageOptions = {},
) {
  if (!container) {
    return;
  }

  const images = Array.from(container.querySelectorAll("img"));

  await Promise.all(
    images.map(async (image) => {
      const source = image.currentSrc || image.src;

      if (!source) {
        return;
      }

      image.setAttribute("decoding", "sync");
      image.setAttribute("loading", "eager");

      if (/^data:|^blob:/.test(source)) {
        await waitForImageToRender(image);
        return;
      }

      const dataUrl = await retryAsync(
        () => fetchImageAsDataUrl(source, cacheBust),
        {
          attempts: retryTimes,
          delayMs: retryDelayMs,
          taskName: `share image preload: ${source}`,
        },
      );

      image.removeAttribute("srcset");
      image.src = dataUrl;

      await waitForImageToRender(image);
    }),
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
