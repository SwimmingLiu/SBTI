import Link from "next/link";

import type { TestCatalogEntry } from "@/lib/test-catalog";

type TestEntryCardProps = {
  entry: TestCatalogEntry;
};

export function TestEntryCard({ entry }: TestEntryCardProps) {
  return (
    <article
      className="min-w-0 flex h-full flex-col rounded-[24px] border border-[var(--line)] bg-white p-6 shadow-[0_18px_40px_rgba(26,42,34,0.06)]"
      data-testid={`test-card-${entry.slug}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div
            className={`inline-flex rounded-full bg-gradient-to-r px-3 py-1.5 text-xs font-semibold tracking-[0.16em] text-white ${entry.accent}`}
          >
            {entry.slug.toUpperCase()}
          </div>
          <h2 className="mt-4 max-w-full whitespace-normal text-[clamp(1.5rem,1.8vw,2rem)] font-semibold leading-tight tracking-[-0.03em] text-[var(--foreground)] sm:whitespace-nowrap">
            {entry.name}
          </h2>
        </div>
        <span className="shrink-0 whitespace-nowrap rounded-full border border-[var(--line)] bg-[var(--soft)] px-3 py-1 text-xs text-[var(--muted)]">
          {entry.status === "live" ? "已开放" : "建设中"}
        </span>
      </div>

      <p className="mt-4 text-sm leading-7 text-[var(--muted)]">{entry.description}</p>

      <dl className="mt-5 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-2xl bg-[var(--soft)] px-4 py-3">
          <dt className="text-[var(--muted)]">题量</dt>
          <dd className="mt-1 text-lg font-semibold text-[var(--foreground)]">
            {entry.questionCount}
          </dd>
        </div>
        <div className="rounded-2xl bg-[var(--soft)] px-4 py-3">
          <dt className="text-[var(--muted)]">结果数</dt>
          <dd className="mt-1 text-lg font-semibold text-[var(--foreground)]">
            {entry.resultCount}
          </dd>
        </div>
      </dl>

      <div className="mt-5 flex flex-wrap gap-2">
        {entry.tags.map((tag) => (
          <span
            className="rounded-full border border-[var(--line)] px-3 py-1 text-xs text-[var(--muted)]"
            key={tag}
          >
            {tag}
          </span>
        ))}
      </div>

      <p className="mt-5 text-sm font-medium text-[var(--accent-strong)]">
        {entry.tagline}
      </p>

      <div className="mt-6">
        {entry.status === "live" ? (
          <Link
            className="inline-flex items-center justify-center rounded-2xl bg-[var(--accent-strong)] px-5 py-3 font-semibold text-white shadow-[0_12px_30px_rgba(77,106,83,0.18)] transition hover:-translate-y-0.5"
            href={entry.href}
          >
            进入 {entry.slug.toUpperCase()}
          </Link>
        ) : (
          <button
            className="inline-flex items-center justify-center rounded-2xl border border-[var(--line)] bg-[var(--soft)] px-5 py-3 font-semibold text-[var(--muted)]"
            disabled
            type="button"
          >
            {entry.slug.toUpperCase()} 即将开放
          </button>
        )}
      </div>
    </article>
  );
}
