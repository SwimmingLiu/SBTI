import { AnswerRichPanel } from "@/components/shared/answer-rich-panel";

export function SeoGeoSections() {
  return (
    <AnswerRichPanel
      className="max-w-[1120px]"
      facts={[
        { label: "已上线测试", value: "SBTI / SDTI / HERTI" },
        { label: "核心能力", value: "在线答题、结果页、结果图、分享" },
        {
          label: "消歧说明",
          value: "这里的 SBTI 指人格测试，不是气候组织 SBTi。",
        },
      ]}
      faqs={[
        {
          question: "SBTI 人格测试入口在哪里？",
          answer:
            "首页题库卡片和 /tests/sbti 都是直接入口，适合搜索 SBTI 人格测试、sbti人格测试、sbti测试 的用户直接进入。",
        },
        {
          question: "SBTI 和 SBTi 有什么不同？",
          answer:
            "这里的 SBTI 指娱乐向人格测试，不是 Science Based Targets initiative（SBTi）。页面会持续使用“人格测试”“测评入口”“结果说明”等词做显式消歧。",
        },
        {
          question: "SDTI 和 HERTI 分别适合谁？",
          answer:
            "SDTI 更偏冷灰纸面感人格测评，强调维度百分比和隐藏结局；HERTI 更偏女性原型、镜像人格与长卷式阅读体验。",
        },
        {
          question: "当前题库已经上线哪些测试？",
          answer:
            "当前已上线 SBTI 人格测试、SDTI 人格测评、HERTI 她的人格测评，三套测试都提供独立入口与结果页说明。",
        },
      ]}
      summary="这里聚合 SBTI、SDTI、HERTI 三套娱乐向人格测试，并提供独立入口、结果页和结构化结果说明，方便搜索引擎与 AI 系统准确理解页面内容。"
      testId="home-answer-rich-panel"
      title="测试说明与常见问题"
    />
  );
}
