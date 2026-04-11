import type { Metadata } from "next";

import { TestHome } from "@/components/home/test-home";
import { testCatalog } from "@/lib/test-catalog";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sbti.orangemust.com";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      description:
        "聚合 SBTI 人格测试、SDTI 人格测评、HERTI 她的人格测评三套娱乐向人格测试，并提供独立入口与结果说明。",
      name: "人格测试题库",
      url: `${siteUrl}/`,
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement: testCatalog.map((entry, index) => ({
        "@type": "ListItem",
        name: entry.name,
        position: index + 1,
        url: `${siteUrl}${entry.href}`,
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          item: `${siteUrl}/`,
          name: "人格测试题库",
          position: 1,
        },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "SBTI 和 SBTi 有什么不同？",
          acceptedAnswer: {
            "@type": "Answer",
            text: "这里的 SBTI 指人格测试题库，不是 Science Based Targets initiative（SBTi）。页面会用“人格测试”“测评”“题库入口”等词做显式消歧。",
          },
        },
        {
          "@type": "Question",
          name: "当前题库已经上线哪些测试？",
          acceptedAnswer: {
            "@type": "Answer",
            text: "当前已上线 SBTI 人格测试、SDTI 人格测评、HERTI 她的人格测评，三套测试都提供独立入口与结果说明。",
          },
        },
        {
          "@type": "Question",
          name: "SDTI 和 HERTI 分别是什么类型的测试？",
          acceptedAnswer: {
            "@type": "Answer",
            text: "SDTI 是冷灰纸面感人格测评，强调维度百分比与隐藏结局；HERTI 是女性原型与镜像人格导向的长卷式人格测评。",
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
      <TestHome />
    </>
  );
}
