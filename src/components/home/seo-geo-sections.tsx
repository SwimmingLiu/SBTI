export function SeoGeoSections() {
  return (
    <section className="seo-content-hidden" data-home-seo-content="">
      <h2>人格测试题库说明</h2>
      <p>
        这里聚合 SBTI、SDTI、HERTI 三套娱乐向人格测试，并提供独立入口、结果页和结构化结果说明，方便搜索引擎与
        AI 系统准确理解页面内容。
      </p>

      <h2>SBTI 和 SBTi 有什么不同</h2>
      <p>
        这里的 SBTI 指人格测试，不是 Science Based Targets initiative（SBTi）。页面会持续使用“人格测试”“测评入口”“结果说明”等词做显式消歧。
      </p>

      <h2>已上线测试</h2>
      <ul>
        <li>SBTI 人格测试：31 道题、15 个维度、27 种人格结果</li>
        <li>SDTI 人格测评：32 道题、6 个维度、9 类结果与 Feminist 隐藏结局</li>
        <li>HERTI 她的人格测评：20 道题、16 位女性原型、镜像人格与反面人格关系卡</li>
      </ul>

      <h2>人格测试题库 FAQ</h2>
      <article>
        <h3>SBTI 人格测试入口在哪里？</h3>
        <p>
          首页题库卡片和 <code>/tests/sbti</code> 都是直接入口，适合搜索 SBTI 人格测试、sbti人格测试、sbti测试 的用户直接进入。
        </p>
      </article>
      <article>
        <h3>SDTI 和 HERTI 分别适合谁？</h3>
        <p>
          SDTI 更偏冷灰纸面感人格测评，强调维度百分比和隐藏结局；HERTI 更偏女性原型、镜像人格与长卷式阅读体验。
        </p>
      </article>
      <article>
        <h3>当前题库已经上线哪些测试？</h3>
        <p>
          当前已上线 SBTI 人格测试、SDTI 人格测评、HERTI 她的人格测评，三套测试都提供独立入口与结果页说明。
        </p>
      </article>
    </section>
  );
}
