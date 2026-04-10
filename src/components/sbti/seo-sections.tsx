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
    <section
      aria-hidden="true"
      className="seo-content-hidden"
      data-seo-content=""
    >
      <h2>SBTI 人格测试是什么</h2>
      <p>
        SBTI 人格测试是一种娱乐向人格测评工具，常见搜索词包括
        “SBTI 人格测试”“sbti人格测试”“sbti测试”“sbti测评”“sbti测评官网”。
        用户的核心需求通常是三类：快速进入测试、了解 31 道题与 15
        维度的结构、以及在结果页查看 27 种人格与隐藏人格说明。
      </p>

      <h2>SBTI 测试入口与流程</h2>
      <ol>
        <li>1. 进入欢迎页后点击“开始测试”，跳转到题目页面。</li>
        <li>2. 完成全部题目后提交，系统会计算人格类型与匹配度。</li>
        <li>3. 结果页会展示人格主图、15 维度评分和结果分享能力。</li>
      </ol>

      <h2>SBTI 结果页会展示什么</h2>
      <p>人格代号、中文名称、匹配度与一句话介绍。</p>
      <p>15 个维度的高、中、低结果与解释。</p>
      <p>支持分享结果图，便于发给朋友或保存图片。</p>

      <h2>SBTI 人格测试 FAQ</h2>
      {faqItems.map((item) => (
        <article key={item.question}>
          <h3>{item.question}</h3>
          <p>{item.answer}</p>
        </article>
      ))}
    </section>
  );
}
