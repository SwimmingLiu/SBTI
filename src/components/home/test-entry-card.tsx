import Link from "next/link";

import type { TestCatalogEntry } from "@/lib/test-catalog";

type TestEntryCardProps = {
  compact?: boolean;
  entry: TestCatalogEntry;
};

export function TestEntryCard({ compact = false, entry }: TestEntryCardProps) {
  const description = compact ? entry.mobileDescription : entry.description;
  const tagline = compact ? entry.mobileTagline : entry.tagline;

  return (
    <article
      className={`min-w-0 flex h-full flex-col border border-[var(--line)] bg-white ${
        compact
          ? "rounded-[20px] p-4 shadow-[0_14px_30px_rgba(26,42,34,0.06)]"
          : "rounded-[24px] p-6 shadow-[0_18px_40px_rgba(26,42,34,0.06)]"
      }`}
      data-testid={`${compact ? "compact-test-card" : "test-card"}-${entry.slug}`}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div
            className={`inline-flex rounded-full bg-gradient-to-r font-semibold tracking-[0.16em] text-white ${
              compact ? "px-3 py-1 text-[11px]" : "px-3 py-1.5 text-xs"
            } ${entry.accent}`}
          >
            {entry.slug.toUpperCase()}
          </div>
          <h2
            className={`max-w-full font-semibold leading-tight tracking-[-0.03em] text-[var(--foreground)] ${
              compact
                ? "mt-3 whitespace-nowrap text-[clamp(1.35rem,5vw,1.7rem)]"
                : "mt-4 whitespace-normal text-[clamp(1.5rem,1.8vw,2rem)] sm:whitespace-nowrap"
            }`}
          >
            {entry.name}
          </h2>
        </div>
        <span
          className={`shrink-0 whitespace-nowrap rounded-full border border-[var(--line)] bg-[var(--soft)] text-[var(--muted)] ${
            compact ? "px-2.5 py-1 text-[11px]" : "px-3 py-1 text-xs"
          }`}
        >
          {entry.status === "live" ? "已开放" : "建设中"}
        </span>
      </div>

      <p className={`text-[var(--muted)] ${compact ? "mt-3 text-sm leading-7" : "mt-4 text-sm leading-7"}`}>
        {description}
      </p>

      <dl className={`grid grid-cols-2 text-sm ${compact ? "mt-4 gap-2.5" : "mt-5 gap-3"}`}>
        <div className={`rounded-2xl bg-[var(--soft)] ${compact ? "px-3 py-2.5" : "px-4 py-3"}`}>
          <dt className="text-[var(--muted)]">题量</dt>
          <dd className={`font-semibold text-[var(--foreground)] ${compact ? "mt-1 text-[1.4rem]" : "mt-1 text-lg"}`}>
            {entry.questionCount}
          </dd>
        </div>
        <div className={`rounded-2xl bg-[var(--soft)] ${compact ? "px-3 py-2.5" : "px-4 py-3"}`}>
          <dt className="text-[var(--muted)]">结果数</dt>
          <dd className={`font-semibold text-[var(--foreground)] ${compact ? "mt-1 text-[1.4rem]" : "mt-1 text-lg"}`}>
            {entry.resultCount}
          </dd>
        </div>
      </dl>

      {compact ? null : (
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
      )}

      <p
        className={`font-medium text-[var(--accent-strong)] ${
          compact ? "mt-4 whitespace-nowrap text-xs" : "mt-5 text-sm"
        }`}
      >
        {tagline}
      </p>

      <div className={compact ? "mt-4" : "mt-6"}>
        {entry.status === "live" ? (
          <Link
            className={`inline-flex items-center justify-center rounded-2xl bg-[var(--accent-strong)] font-semibold text-white shadow-[0_12px_30px_rgba(77,106,83,0.18)] transition hover:-translate-y-0.5 ${
              compact ? "w-full px-5 py-3" : "px-5 py-3"
            }`}
            href={entry.href}
          >
            进入 {entry.slug.toUpperCase()}
          </Link>
        ) : (
          <button
            className={`inline-flex items-center justify-center rounded-2xl border border-[var(--line)] bg-[var(--soft)] font-semibold text-[var(--muted)] ${
              compact ? "w-full px-5 py-3" : "px-5 py-3"
            }`}
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
