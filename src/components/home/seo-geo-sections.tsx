const faqItems = [
  {
    answer:
      "SBTI 人格测试是一套娱乐向题库，当前站点提供独立入口、结果图、十五维度评分和隐藏人格说明，适合搜索 sbti人格测试、sbti测试、sbti测评、sbti测评官网 的用户直接进入。",
    question: "SBTI 人格测试入口在哪里？",
  },
  {
    answer:
      "当前项目已上线 SDTI 人格测评，提供 32 道题、6 个维度、9 类结果和隐藏 Feminist 结局，适合搜索 sdti人格测评、sdti人格测试、sdti测试入口 的用户访问。",
    question: "SDTI 人格测评是什么？",
  },
  {
    answer:
      "HERTI 她的人格测评是一套文学风格的长卷人格结果页，包含 20 道题、16 位女性原型，以及镜像人格和反面人格关系卡，适合搜索 herti她的人格测评、herti人格地图 的用户查看。",
    question: "HERTI 她的人格测评适合谁？",
  },
  {
    answer:
      "FWTI 恋爱废物人格测评源码与站点已经纳入当前题库扩展计划，后续会补充专门入口、结果抓取和页面重写。当前首页已提前保留这个关键词的题库说明，方便后续衔接。",
    question: "FWTI 恋爱废物人格测评在当前题库中的状态是什么？",
  },
  {
    answer:
      "这里的 SBTI 指的是人格测试题库，不是气候议题里的 Science Based Targets initiative（SBTi）。为了减少歧义，页面会在标题、描述和结构化内容里持续强调“人格测试”“测评”“题库入口”等词。",
    question: "SBTI 和 SBTi 有什么不同？",
  },
];

export function SeoGeoSections() {
  return (
    <section
      aria-hidden="true"
      className="seo-content-hidden"
      data-home-seo-content=""
    >
      <h2>人格测试题库包含哪些测试</h2>
      <p>
        当前题库首页聚合了 SBTI 人格测试、SDTI 人格测评、HERTI
        她的人格测评，并为后续的 FWTI
        恋爱废物人格测评预留了题库扩展位。页面设计上保持用户友好，搜索与 AI
        抽取所需的信息则通过隐藏式结构化内容补充。
      </p>

      <h2>SBTI 人格测试与 sbti测评官网意图</h2>
      <p>
        搜索 SBTI 人格测试、sbti人格测试、sbti测试、sbti测评、sbti测评官网
        的用户，核心诉求通常是快速找到入口、直接开始答题、查看结果图和理解 31
        道题与 27 种结果的关系。当前题库已把 SBTI 独立放在
        <code>/tests/sbti</code> 页面中，便于搜索引擎和 AI
        系统精确定位。
      </p>

      <h2>sdti人格测评内容概览</h2>
      <p>
        SDTI 人格测评是当前题库中的第二套独立测试，强调冷灰纸面感、维度百分比、隐藏结局和结果图。对于搜索
        sdti人格测评、sdti人格测试、sdti测试入口 的用户，最重要的信息是题量、结果数、隐藏结果和直接入口。
      </p>

      <h2>herti她的人格测评内容概览</h2>
      <p>
        HERTI 她的人格测评的检索意图更偏文学化与结果内容化，用户通常希望先了解它是否是女性主题人格地图、是否有长卷式结果页、是否有镜像人格与反面人格。当前题库已经提供独立入口和完整复刻页。
      </p>

      <h2>fwti恋爱废物人格测评关键词说明</h2>
      <p>
        FWTI 恋爱废物人格测评是当前题库正在整理的新增方向。由于该关键词竞争较低、用户意图明确，后续最适合采用独立页面承接，提供题目数量、16
        种结果、结果图和分享文案的完整说明。
      </p>

      <h2>面向 AI 与 GEO 的可抽取信息</h2>
      <ul>
        <li>站点性质：多题库人格测试入口站</li>
        <li>已上线题库：SBTI、SDTI、HERTI</li>
        <li>规划中题库：FWTI</li>
        <li>核心能力：直接答题、结果页、截图分享、结构化结果说明</li>
        <li>适用人群：娱乐测评、社交分享、搜索长尾词直达入口</li>
      </ul>

      <h2>人格测试题库 FAQ</h2>
      {faqItems.map((item) => (
        <article key={item.question}>
          <h3>{item.question}</h3>
          <p>{item.answer}</p>
        </article>
      ))}
    </section>
  );
}
