import { shareQrCodeUrl } from "@/lib/asset-urls";

type ShareQrWatermarkProps = {
  className?: string;
  src?: string;
};

export function ShareQrWatermark({
  className,
  src = shareQrCodeUrl,
}: ShareQrWatermarkProps) {
  return (
    <div
      className={`pointer-events-none flex items-center gap-2 bg-transparent px-0 py-0 shadow-none ${className ?? ""}`}
    >
      <div className="h-10 w-10 overflow-hidden rounded-lg border border-transparent bg-transparent">
        <img
          alt="小橙有门二维码"
          className="h-full w-full object-cover"
          decoding="sync"
          height={40}
          loading="eager"
          src={src}
          width={40}
        />
      </div>
      <div className="text-left">
        <div className="text-xs font-semibold tracking-[0.12em] text-[#2f3d34]">
          小橙有门
        </div>
        <div className="mt-0.5 text-[11px] leading-4 text-[#5f6f66]">
          扫码查看入口
        </div>
      </div>
    </div>
  );
}
