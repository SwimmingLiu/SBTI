import { shareQrCodeUrl, shareQrPlaceholderUrl } from "@/lib/asset-urls";

export type MiniProgramConfig = {
  appName: string;
  miniProgramUrl: string;
  qrCodeUrl: string;
};

type MiniProgramEnv = {
  hasMiniProgramApi?: boolean;
  userAgent: string;
  wxEnv?: string;
};

type AutoRedirectInput = {
  isInMiniProgram: boolean;
  isMobile: boolean;
  miniProgramUrl: string;
  search: string;
};

const DEFAULT_MINI_PROGRAM_URL = "https://wxaurl.cn/MG3YoSpo23s";
const DEFAULT_REAL_QR_CODE_URL = shareQrCodeUrl;
const DEFAULT_QR_CODE_URL = shareQrPlaceholderUrl;

export function getMiniProgramConfig(): MiniProgramConfig {
  return {
    appName: process.env.NEXT_PUBLIC_MINIPROGRAM_NAME ?? "SBTI 微信小程序",
    miniProgramUrl:
      process.env.NEXT_PUBLIC_MINIPROGRAM_URL ?? DEFAULT_MINI_PROGRAM_URL,
    qrCodeUrl: process.env.NEXT_PUBLIC_MINIPROGRAM_QRCODE_URL
      ?? DEFAULT_REAL_QR_CODE_URL
      ?? DEFAULT_QR_CODE_URL,
  };
}

export function isWechat(userAgent: string) {
  return userAgent.toLowerCase().includes("micromessenger");
}

export function isWechatMiniProgram({
  hasMiniProgramApi,
  userAgent,
  wxEnv,
}: MiniProgramEnv) {
  if (wxEnv === "miniprogram") {
    return true;
  }

  if (hasMiniProgramApi) {
    return true;
  }

  return userAgent.toLowerCase().includes("miniprogram");
}

export function isCurrentMiniProgramWebView() {
  if (typeof window === "undefined") {
    return false;
  }

  return isWechatMiniProgram({
    hasMiniProgramApi: Boolean(
      (window as {
        wx?: {
          miniProgram?: unknown;
        };
      }).wx?.miniProgram,
    ),
    userAgent: window.navigator.userAgent,
    wxEnv: (window as { __wxjs_environment?: string }).__wxjs_environment,
  });
}

export function shouldAutoRedirectToMiniProgram({
  isInMiniProgram,
  isMobile,
  miniProgramUrl,
  search,
}: AutoRedirectInput) {
  if (!miniProgramUrl) {
    return false;
  }

  if (!isMobile || isInMiniProgram) {
    return false;
  }

  const searchParams = new URLSearchParams(search);
  return searchParams.get("disableMiniProgramRedirect") !== "1";
}
