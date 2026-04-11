import { AnswerRichPanel } from "@/components/shared/answer-rich-panel";

export function SdtiSeoSections() {
  return (
    <AnswerRichPanel
      className="max-w-[760px]"
      facts={[
        { label: "题量", value: "32 道题" },
        { label: "维度", value: "6 个维度" },
        { label: "结果", value: "9 类结果 + Feminist 隐藏结局" },
      ]}
      faqs={[
        {
          question: "SDTI 人格测评是什么？",
          answer:
            "SDTI 是一套冷灰纸面风格的人格测评，完成 32 道题后会生成维度百分比、结果文案和结果说明。",
        },
        {
          question: "SDTI 结果页会展示什么？",
          answer:
            "结果页会展示结果名称、结果文案、维度百分比、结果注释，以及 Feminist 隐藏结局的提示信息。",
        },
        {
          question: "SDTI 适合什么用户？",
          answer:
            "适合想做轻娱乐人格测评、查看维度百分比、对隐藏结局和彩蛋结果感兴趣的用户。",
        },
        {
          question: "SDTI 测试入口在哪里？",
          answer:
            "当前页面就是 SDTI 人格测评入口，适合搜索 sdti人格测评 的用户直接开始答题和查看结果。",
        },
      ]}
      summary="SDTI 人格测评在线入口，围绕题量、维度、结果和隐藏结局组织页面信息，方便搜索引擎与 AI 系统准确判断这是人格测评而非其他缩写含义。"
      testId="sdti-answer-rich-panel"
      title="SDTI 测评说明与常见问题"
    />
  );
}
