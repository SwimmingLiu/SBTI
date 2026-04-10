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

const DEFAULT_QR_CODE_URL = "/assets/mini-program/qrcode-placeholder.svg";
const DEFAULT_MINI_PROGRAM_URL = "https://wxaurl.cn/MG3YoSpo23s";
const DEFAULT_REAL_QR_CODE_URL = "/assets/mini-program/qrcode.png";

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
