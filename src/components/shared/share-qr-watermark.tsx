import Image from "next/image";

import { shareQrCodeUrl } from "@/lib/result-share";

type ShareQrWatermarkProps = {
  className?: string;
};

export function ShareQrWatermark({ className }: ShareQrWatermarkProps) {
  return (
    <div
      className={`pointer-events-none flex items-center gap-3 rounded-2xl border border-white/70 bg-white/88 px-3 py-2 shadow-[0_8px_24px_rgba(0,0,0,0.08)] backdrop-blur ${className ?? ""}`}
    >
      <div className="relative h-12 w-12 overflow-hidden rounded-lg border border-[#e5ece6] bg-white">
        <Image
          alt="小橙有门二维码"
          className="object-cover"
          fill
          sizes="48px"
          src={shareQrCodeUrl}
          unoptimized
        />
      </div>
      <div className="text-left">
        <div className="text-xs font-semibold tracking-[0.12em] text-[#2f3d34]">
          小橙有门
        </div>
        <div className="mt-1 text-[11px] leading-4 text-[#5f6f66]">
          扫码查看入口
        </div>
      </div>
    </div>
  );
}
