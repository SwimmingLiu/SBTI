import { AnswerRichPanel } from "@/components/shared/answer-rich-panel";

export function HertiSeoSections() {
  return (
    <AnswerRichPanel
      className="max-w-[520px]"
      facts={[
        { label: "题量", value: "20 道题" },
        { label: "原型", value: "16 位女性原型" },
        { label: "结果结构", value: "主人格、镜像人格、反面人格" },
      ]}
      faqs={[
        {
          question: "HERTI 她的人格测评是什么？",
          answer:
            "HERTI 是一套文学风格的人格测评，完成 20 道题后会得到一位女性原型，并展示镜像人格与反面人格的关系卡。",
        },
        {
          question: "HERTI 结果页包含哪些信息？",
          answer:
            "结果页包含主人格代号、中文名、epigraph、persona 段落、灵魂原型，以及镜像人格和反面人格关系卡。",
        },
        {
          question: "为什么有人搜索 HERTI 人格地图？",
          answer:
            "因为 HERTI 的结果页不是简单卡片，而是长卷式的人格地图阅读体验，适合搜索 herti她的人格测评、herti人格地图 的用户查看。",
        },
        {
          question: "HERTI 适合什么用户？",
          answer:
            "适合更关注人物原型、女性主题、文学表达与长卷式阅读体验的用户。",
        },
      ]}
      summary="HERTI 她的人格测评在线入口，突出 16 位女性原型、镜像人格、反面人格与长卷式结果页，帮助搜索引擎和 AI 系统准确理解其独特结果结构。"
      testId="herti-answer-rich-panel"
      title="HERTI 测评说明与常见问题"
    />
  );
}
