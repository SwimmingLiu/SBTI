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
      className={`pointer-events-none flex items-center gap-3 bg-transparent px-0 py-0 shadow-none ${className ?? ""}`}
    >
      <div className="h-11 w-11 overflow-hidden rounded-xl border border-transparent bg-transparent">
        <img
          alt="小橙有门二维码"
          className="h-full w-full object-cover"
          decoding="sync"
          height={44}
          loading="eager"
          src={src}
          width={44}
        />
      </div>
      <div className="whitespace-nowrap text-[12px] font-semibold text-[#2f3d34]">
        小橙有门 · 扫码开始测试
      </div>
    </div>
  );
}
