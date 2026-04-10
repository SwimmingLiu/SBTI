import Image from "next/image";

type MiniProgramDialogProps = {
  appName: string;
  isOpen: boolean;
  miniProgramUrl: string;
  onClose: () => void;
  qrCodeUrl: string;
};

export function MiniProgramDialog({
  appName,
  isOpen,
  miniProgramUrl,
  onClose,
  qrCodeUrl,
}: MiniProgramDialogProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      aria-labelledby="miniProgramDialogTitle"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
      role="dialog"
    >
      <div className="w-full max-w-md rounded-[24px] border border-[var(--line)] bg-[var(--panel)] p-6 shadow-[0_16px_40px_rgba(47,73,55,0.2)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2
              className="text-xl font-semibold text-[var(--foreground)]"
              id="miniProgramDialogTitle"
            >
              打开微信小程序
            </h2>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              扫码进入 {appName}，或使用下方按钮直接跳转。
            </p>
          </div>
          <button
            aria-label="Close dialog"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--line)] text-[var(--muted)] transition hover:border-[var(--accent)] hover:text-[var(--foreground)]"
            onClick={onClose}
            type="button"
          >
            <svg
              aria-hidden="true"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6 6L18 18M18 6L6 18"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="2"
              />
            </svg>
          </button>
        </div>

        <div className="mt-5 rounded-[20px] border border-[var(--line)] bg-white p-4">
          <div className="relative mx-auto aspect-square w-full max-w-xs overflow-hidden rounded-xl">
            <Image
              alt={`${appName}码`}
              className="object-contain"
              fill
              sizes="(max-width: 640px) 100vw, 320px"
              src={qrCodeUrl}
            />
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <a
            className={`flex items-center justify-center rounded-2xl px-5 py-3 text-center font-semibold transition ${
              miniProgramUrl
                ? "bg-[var(--accent-strong)] text-white shadow-[0_12px_30px_rgba(77,106,83,0.18)] hover:-translate-y-0.5"
                : "cursor-not-allowed bg-[var(--soft)] text-[var(--muted)]"
            }`}
            href={miniProgramUrl || undefined}
            rel="noreferrer"
            target="_blank"
          >
            打开微信小程序
          </a>
          <a
            className="flex items-center justify-center rounded-2xl border border-[var(--line)] bg-white px-5 py-3 text-center font-semibold text-[var(--accent-strong)] transition hover:-translate-y-0.5"
            download
            href={qrCodeUrl}
          >
            下载小程序码
          </a>
        </div>
      </div>
    </div>
  );
}
