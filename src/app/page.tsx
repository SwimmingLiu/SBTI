import { SeoSections } from "@/components/sbti/seo-sections";
import { SbtiApp } from "@/components/sbti/sbti-app";

export default function Home() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      description:
        "SBTI 人格测试在线入口，覆盖 sbti人格测试、sbti测试、sbti测评 等常见搜索需求。",
      name: "SBTI 人格测试",
      url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://sbti.unun.dev",
    },
    {
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: "SBTI 测试流程",
      step: [
        { "@type": "HowToStep", name: "点击开始测试" },
        { "@type": "HowToStep", name: "完成全部题目" },
        { "@type": "HowToStep", name: "查看人格结果与匹配度" },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "SBTI 人格测试是什么？",
          acceptedAnswer: {
            "@type": "Answer",
            text: "SBTI 人格测试是一套以 31 道题、15 个维度和 27 种人格结果为核心的娱乐向人格测评。",
          },
        },
        {
          "@type": "Question",
          name: "SBTI 测评官网入口在哪里？",
          acceptedAnswer: {
            "@type": "Answer",
            text: "当前页面提供 SBTI 测试入口、结果页和分享能力，适合搜索 sbti测评官网、sbti官网入口、sbti测试入口 的用户直接访问。",
          },
        },
      ],
    },
  ];

  return (
    <>
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        type="application/ld+json"
      />
      <SbtiApp />
      <SeoSections />
    </>
  );
}
