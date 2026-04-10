type IntroScreenProps = {
  appName: string;
  showMiniProgramEntry: boolean;
  onOpenMiniProgram: () => void;
  onStart: () => void;
};

export function IntroScreen({
  appName,
  showMiniProgramEntry,
  onOpenMiniProgram,
  onStart,
}: IntroScreenProps) {
  return (
    <section className="w-full">
      <div className="card-shell px-4 pb-14 pt-6">
        <div className="mx-auto mt-5 max-w-[980px] rounded-[22px] border border-[var(--line)] bg-[var(--panel)] p-10 text-center shadow-[0_16px_40px_rgba(47,73,55,0.08)]">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-[var(--line)] bg-[var(--soft)] px-3 py-2 text-xs text-[var(--accent-strong)]">
            SBTI PERSONA TEST
          </div>
          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-semibold tracking-[-0.03em] text-[var(--foreground)] md:text-6xl">
            SBTI 人格测试
          </h1>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button
              className="rounded-2xl bg-[var(--accent-strong)] px-6 py-3 text-base font-semibold text-white shadow-[0_12px_30px_rgba(77,106,83,0.18)] transition hover:-translate-y-0.5"
              onClick={onStart}
              type="button"
            >
              开始测试
            </button>
          </div>
          {showMiniProgramEntry ? (
            <>
              <div className="mt-3 flex justify-center">
                <button
                  className="rounded-2xl border border-[var(--line)] bg-white px-6 py-3 text-base font-semibold text-[var(--accent-strong)] transition hover:-translate-y-0.5"
                  onClick={onOpenMiniProgram}
                  type="button"
                >
                  查看小程序码
                </button>
              </div>
              <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-[var(--muted)]">
                如需在微信内体验，可打开 {appName} 并通过小程序码进入。
              </p>
            </>
          ) : null}
        </div>
      </div>
    </section>
  );
}
