import { AnswerRichPanel } from "@/components/shared/answer-rich-panel";

export function SeoSections() {
  return (
    <AnswerRichPanel
      className="max-w-[980px]"
      facts={[
        { label: "题量", value: "31 道题" },
        { label: "维度", value: "15 个维度" },
        { label: "结果", value: "27 种人格结果 + 隐藏人格" },
      ]}
      faqs={[
        {
          question: "SBTI 人格测试是什么？",
          answer:
            "SBTI 人格测试是一套娱乐向人格测评，用户完成 31 道题后会得到人格代号、匹配度、15 维度评分和结果说明。",
        },
        {
          question: "SBTI 测评入口在哪里？",
          answer:
            "当前页面就是 SBTI 测评入口，适合搜索 sbti测试、sbti测评入口、sbti测评官网 的用户直接开始答题。",
        },
        {
          question: "这里的 SBTI 和气候组织 SBTi 有什么区别？",
          answer:
            "这里的 SBTI 指娱乐向人格测试，不是 Science Based Targets initiative（SBTi）。本页提供的是人格测试入口、题量结构和结果说明。",
        },
        {
          question: "SBTI 结果怎么看？",
          answer:
            "结果页主要看三部分：人格代号与中文名称、匹配度、15 个维度评分。页面还支持查看结果图与分享结果。",
        },
      ]}
      summary="SBTI 人格测试在线入口，覆盖 sbti人格测试、sbti测试、sbti测评入口、sbti测评官网 等常见搜索需求，强调题量结构、结果数量和结果说明。"
      testId="sbti-answer-rich-panel"
      title="SBTI 测试说明与结果解读"
    />
  );
}
