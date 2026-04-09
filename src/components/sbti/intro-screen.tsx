type IntroScreenProps = {
  onStart: () => void;
};

export function IntroScreen({ onStart }: IntroScreenProps) {
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
          <p className="mx-auto mt-4 max-w-2xl text-base leading-8 text-[var(--muted)]">
            保留原站题库、隐藏题与结果机制的本地复刻版本。先做题，再等系统审判。
          </p>
          <div className="mt-8 flex justify-center">
            <button
              className="rounded-2xl bg-[var(--accent-strong)] px-6 py-3 text-base font-semibold text-white shadow-[0_12px_30px_rgba(77,106,83,0.18)] transition hover:-translate-y-0.5"
              onClick={onStart}
              type="button"
            >
              开始测试
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
