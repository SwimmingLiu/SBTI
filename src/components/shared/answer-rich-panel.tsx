type FactItem = {
  label: string;
  value: string;
};

type FaqItem = {
  answer: string;
  question: string;
};

type AnswerRichPanelProps = {
  className?: string;
  facts: FactItem[];
  faqs: FaqItem[];
  summary: string;
  testId: string;
  title: string;
};

export function AnswerRichPanel({
  className,
  facts,
  faqs,
  summary,
  testId,
  title,
}: AnswerRichPanelProps) {
  return (
    <section
      className={[
        "mx-auto mt-8 rounded-[24px] border border-[var(--line)] bg-white/88 px-5 py-6 shadow-[0_12px_32px_rgba(26,42,34,0.04)] md:px-6",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      data-testid={testId}
    >
      <h2 className="text-xl font-semibold tracking-[-0.02em] text-[var(--foreground)]">
        {title}
      </h2>
      <p className="mt-3 text-sm leading-7 text-[var(--muted)]">{summary}</p>

      <dl className="mt-5 grid gap-3 md:grid-cols-3">
        {facts.map((item) => (
          <div
            className="rounded-2xl bg-[var(--soft)] px-4 py-3"
            key={item.label}
          >
            <dt className="text-xs text-[var(--muted)]">{item.label}</dt>
            <dd className="mt-1 text-sm font-medium leading-6 text-[var(--foreground)]">
              {item.value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {faqs.map((item) => (
          <article
            className="rounded-2xl border border-[var(--line)] px-4 py-4"
            key={item.question}
          >
            <h3 className="text-sm font-semibold text-[var(--foreground)]">
              {item.question}
            </h3>
            <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
              {item.answer}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
