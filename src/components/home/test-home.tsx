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
          <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--muted)] md:text-lg">
            这里不是单个测试页，而是一套正在持续扩展的题库站。当前项目保留
            SBTI，并继续接入 SDTI 与 HERTI 两个新题库；每个题库都按原站逻辑做浏览器级取证、结果提取和本地重写。
          </p>
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
