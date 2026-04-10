const faqItems = [
  {
    answer:
      "SBTI 人格测试是一套以 31 道题、15 个维度和 27 种结果为核心的娱乐向人格测评。用户搜索 sbti测试、sbti人格测试、sbti测评 时，最常见需求是直接进入测试页面并快速看懂结果。",
    question: "SBTI 人格测试是什么？",
  },
  {
    answer:
      "SBTI 测试通常分为欢迎页、答题页和结果页。开始测试后进入题目区，完成全部题目即可查看人格结果、匹配度和 15 维度评分。",
    question: "SBTI 测试怎么做？",
  },
  {
    answer:
      "当前页面支持 SBTI 测评在线入口、结果图查看、结果分享和移动端体验，适合搜索 sbti测评官网、sbti官网入口、sbti测试入口 的用户直接访问。",
    question: "SBTI 测评官网入口在哪里？",
  },
  {
    answer:
      "SBTI 结果主要看三部分：人格代号与中文名称、匹配度、15 维度评分。部分题目还会触发隐藏人格或兜底结果。",
    question: "SBTI 结果怎么看？",
  },
];

export function SeoSections() {
  return (
    <section className="w-full border-t border-[var(--line)] bg-white/70">
      <div className="mx-auto max-w-[980px] px-4 py-12">
        <div className="grid gap-6">
          <section className="rounded-[24px] border border-[var(--line)] bg-[var(--panel)] p-6">
            <h2 className="text-2xl font-semibold text-[var(--foreground)]">
              SBTI 人格测试是什么
            </h2>
            <p className="mt-4 text-base leading-8 text-[var(--muted)]">
              SBTI 人格测试是一种娱乐向人格测评工具，常见搜索词包括
              “SBTI 人格测试”“sbti人格测试”“sbti测试”“sbti测评”“sbti测评官网”。
              用户的核心需求通常是三类：快速进入测试、了解 31 道题与 15
              维度的结构、以及在结果页查看 27 种人格与隐藏人格说明。
            </p>
          </section>

          <section className="rounded-[24px] border border-[var(--line)] bg-[var(--panel)] p-6">
            <h2 className="text-2xl font-semibold text-[var(--foreground)]">
              SBTI 测试入口与流程
            </h2>
            <ol className="mt-4 grid gap-3 text-base leading-8 text-[var(--muted)]">
              <li>1. 进入欢迎页后点击“开始测试”，跳转到题目页面。</li>
              <li>2. 完成全部题目后提交，系统会计算人格类型与匹配度。</li>
              <li>3. 结果页会展示人格主图、15 维度评分和结果分享能力。</li>
            </ol>
          </section>

          <section className="rounded-[24px] border border-[var(--line)] bg-[var(--panel)] p-6">
            <h2 className="text-2xl font-semibold text-[var(--foreground)]">
              SBTI 结果页会展示什么
            </h2>
            <div className="mt-4 grid gap-3 text-base leading-8 text-[var(--muted)]">
              <p>· 人格代号、中文名称、匹配度与一句话介绍</p>
              <p>· 15 个维度的高/中/低结果与解释</p>
              <p>· 支持分享结果图，便于发给朋友或保存图片</p>
            </div>
          </section>

          <section className="rounded-[24px] border border-[var(--line)] bg-[var(--panel)] p-6">
            <h2 className="text-2xl font-semibold text-[var(--foreground)]">
              SBTI 人格测试 FAQ
            </h2>
            <div className="mt-4 grid gap-4">
              {faqItems.map((item) => (
                <article
                  className="rounded-2xl border border-[var(--line)] bg-white p-4"
                  key={item.question}
                >
                  <h3 className="text-lg font-semibold text-[var(--foreground)]">
                    {item.question}
                  </h3>
                  <p className="mt-2 text-base leading-7 text-[var(--muted)]">
                    {item.answer}
                  </p>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
