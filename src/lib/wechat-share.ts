const DEFAULT_SIGNATURE_ENDPOINT = "/common/wx/oa/signature";
const WECHAT_JSSDK_SRC = "https://res.wx.qq.com/open/js/jweixin-1.6.0.js";

export const wechatShareApiList = [
  "updateAppMessageShareData",
  "updateTimelineShareData",
  "onMenuShareAppMessage",
  "onMenuShareTimeline",
] as const;

export type WechatSignatureData = {
  appId: string;
  nonceStr: string;
  signature: string;
  timestamp: number;
};

export type WechatShareContent = {
  desc: string;
  imgUrl: string;
  link: string;
  title: string;
};

type WechatReadyCallback = () => void;
type WechatErrorCallback = (error: unknown) => void;

type WechatAppMessagePayload = WechatShareContent & {
  cancel?: () => void;
  complete?: () => void;
  fail?: (error: unknown) => void;
  success?: () => void;
};

type WechatTimelinePayload = Pick<WechatShareContent, "imgUrl" | "link" | "title"> & {
  cancel?: () => void;
  complete?: () => void;
  fail?: (error: unknown) => void;
  success?: () => void;
};

type WechatSdk = {
  config: (payload: {
    appId: string;
    debug: boolean;
    jsApiList: readonly string[];
    nonceStr: string;
    signature: string;
    timestamp: number;
  }) => void;
  error: (callback: WechatErrorCallback) => void;
  onMenuShareAppMessage?: (payload: WechatAppMessagePayload) => void;
  onMenuShareTimeline?: (payload: WechatTimelinePayload) => void;
  ready: (callback: WechatReadyCallback) => void;
  updateAppMessageShareData?: (payload: WechatAppMessagePayload) => void;
  updateTimelineShareData?: (payload: WechatTimelinePayload) => void;
};

declare global {
  interface Window {
    wx?: WechatSdk;
  }
}

let sdkPromise: Promise<WechatSdk> | null = null;
let configuredSignatureUrl = "";
let entrySignatureUrl: string | null = null;
let readyPromise: Promise<WechatSdk> | null = null;

const signaturePromiseCache = new Map<string, Promise<WechatSignatureData>>();

export function normalizeWechatSignatureUrl(url: string) {
  return url.split("#")[0];
}

if (typeof window !== "undefined" && entrySignatureUrl === null) {
  entrySignatureUrl = normalizeWechatSignatureUrl(window.location.href);
}

export function buildWechatShareLink({
  origin,
  slug,
}: {
  origin: string;
  slug: string;
}) {
  return new URL(`/tests/${slug}/`, origin).toString();
}

export function resolveWechatSignatureEndpoint() {
  return process.env.NEXT_PUBLIC_WECHAT_OA_SIGNATURE_ENDPOINT?.trim()
    || DEFAULT_SIGNATURE_ENDPOINT;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function resolveWechatSignatureData(payload: unknown): WechatSignatureData {
  const resolved = isRecord(payload) && isRecord(payload.data) ? payload.data : payload;

  if (!isRecord(resolved)) {
    throw new Error("Invalid wechat signature response");
  }

  const appId = resolved.appId;
  const nonceStr = resolved.nonceStr;
  const signature = resolved.signature;
  const timestamp = resolved.timestamp;

  if (
    typeof appId !== "string"
    || typeof nonceStr !== "string"
    || typeof signature !== "string"
    || (typeof timestamp !== "number" && typeof timestamp !== "string")
  ) {
    throw new Error("Incomplete wechat signature response");
  }

  return {
    appId,
    nonceStr,
    signature,
    timestamp: Number(timestamp),
  };
}

function isIosWechatUserAgent(userAgent: string) {
  return /micromessenger/i.test(userAgent) && /(iphone|ipad|ipod)/i.test(userAgent);
}

function resolveWechatSignatureUrl() {
  if (typeof window === "undefined") {
    return "";
  }

  const currentUrl = normalizeWechatSignatureUrl(window.location.href);

  if (!isIosWechatUserAgent(window.navigator.userAgent)) {
    return currentUrl;
  }

  entrySignatureUrl ??= currentUrl;
  return entrySignatureUrl;
}

async function loadWechatSdk() {
  if (typeof window === "undefined") {
    throw new Error("Wechat JS-SDK can only load in the browser");
  }

  if (window.wx) {
    return window.wx;
  }

  if (!sdkPromise) {
    sdkPromise = new Promise<WechatSdk>((resolve, reject) => {
      const existing = document.querySelector<HTMLScriptElement>(
        'script[data-wechat-jssdk="true"]',
      );

      const resolveSdk = () => {
        if (!window.wx) {
          reject(new Error("Wechat JS-SDK loaded without window.wx"));
          return;
        }

        resolve(window.wx);
      };

      if (existing) {
        existing.addEventListener("load", resolveSdk, { once: true });
        existing.addEventListener(
          "error",
          () => reject(new Error("Failed to load Wechat JS-SDK")),
          { once: true },
        );
        return;
      }

      const script = document.createElement("script");
      script.async = true;
      script.dataset.wechatJssdk = "true";
      script.onerror = () => reject(new Error("Failed to load Wechat JS-SDK"));
      script.onload = resolveSdk;
      script.src = WECHAT_JSSDK_SRC;
      document.head.appendChild(script);
    });
  }

  return sdkPromise;
}

async function fetchWechatSignature(url: string) {
  const response = await fetch(resolveWechatSignatureEndpoint(), {
    body: JSON.stringify({ url }),
    headers: {
      "Content-Type": "application/json",
    },
    method: "POST",
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch wechat signature: ${response.status}`);
  }

  return resolveWechatSignatureData(await response.json());
}

function getWechatSignature(url: string) {
  if (!signaturePromiseCache.has(url)) {
    signaturePromiseCache.set(url, fetchWechatSignature(url));
  }

  return signaturePromiseCache.get(url)!;
}

function stringifyWechatError(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  try {
    return JSON.stringify(error);
  } catch {
    return String(error);
  }
}

function configureWechatSdk(
  wx: WechatSdk,
  signatureUrl: string,
  signature: WechatSignatureData,
) {
  if (configuredSignatureUrl === signatureUrl && readyPromise) {
    return readyPromise;
  }

  configuredSignatureUrl = signatureUrl;
  readyPromise = new Promise<WechatSdk>((resolve, reject) => {
    let settled = false;

    wx.ready(() => {
      if (settled) {
        return;
      }

      settled = true;
      resolve(wx);
    });

    wx.error((error) => {
      if (settled) {
        return;
      }

      settled = true;
      reject(new Error(`Wechat JS-SDK config failed: ${stringifyWechatError(error)}`));
    });

    wx.config({
      ...signature,
      debug: false,
      jsApiList: wechatShareApiList,
    });
  });

  return readyPromise;
}

export async function syncWechatShareData(shareContent: WechatShareContent) {
  if (typeof window === "undefined" || !window.navigator.userAgent) {
    return false;
  }

  const signatureUrl = resolveWechatSignatureUrl();

  if (!signatureUrl) {
    return false;
  }

  const wx = await loadWechatSdk();
  const signature = await getWechatSignature(signatureUrl);
  const readyWx = await configureWechatSdk(wx, signatureUrl, signature);

  const appMessagePayload: WechatAppMessagePayload = {
    ...shareContent,
  };
  const timelinePayload: WechatTimelinePayload = {
    imgUrl: shareContent.imgUrl,
    link: shareContent.link,
    title: shareContent.title,
  };

  readyWx.updateAppMessageShareData?.(appMessagePayload);
  readyWx.updateTimelineShareData?.(timelinePayload);
  readyWx.onMenuShareAppMessage?.(appMessagePayload);
  readyWx.onMenuShareTimeline?.(timelinePayload);

  return true;
}
