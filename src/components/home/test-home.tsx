import { TestEntryCard } from "@/components/home/test-entry-card";
import { testCatalog } from "@/lib/test-catalog";

export function TestHome() {
  return (
    <main className="px-4 pb-16 pt-8">
      <section className="mx-auto max-w-[1120px] rounded-[28px] border border-[var(--line)] bg-[var(--panel)] px-6 py-10 shadow-[0_18px_44px_rgba(26,42,34,0.06)] md:px-10 md:py-12">
        <div className="max-w-3xl">
          <div className="inline-flex rounded-full border border-[var(--line)] bg-[var(--soft)] px-3 py-2 text-xs font-semibold tracking-[0.16em] text-[var(--accent-strong)]">
            PERSONA TEST LIBRARY
          </div>
          <h1 className="mt-6 text-4xl font-semibold tracking-[-0.04em] text-[var(--foreground)] md:text-6xl">
            人格测试题库
          </h1>
        </div>

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {testCatalog.map((entry) => (
            <TestEntryCard entry={entry} key={entry.slug} />
          ))}
        </div>
      </section>
    </main>
  );
}
