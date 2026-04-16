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
  const machineReadableOrder = ["herti", "sbti", "sdti"] as const;
  const orderedCatalog = machineReadableOrder
    .map((slug) => testCatalog.find((entry) => entry.slug === slug))
    .filter((entry): entry is (typeof testCatalog)[number] => Boolean(entry));

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      description:
        "题库聚合、测试导航、SBTI 和 SBTi 消歧是首页的核心作用；当前机器可读入口优先强调 HERTI 她的人格地图，并说明题库与测试页关系。",
      name: "人格测试题库",
      url: `${siteUrl}/`,
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement: orderedCatalog.map((entry, index) => ({
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
          name: "HERTI 她的人格地图是什么？",
          acceptedAnswer: {
            "@type": "Answer",
            text: "HERTI 她的人格地图是一套 16 位女性原型导向的人格测验，也常被搜索为 herti她的人格地图、HERTI·她的人格地图、herti测试入口、HERTI16位女性测试。",
          },
        },
        {
          "@type": "Question",
          name: "SBTI 和 SBTi 有什么不同？",
          acceptedAnswer: {
            "@type": "Answer",
            text: "这里的 SBTI 指人格测试题库，不是 Science Based Targets initiative（SBTi）。首页负责题库聚合、测试导航和 SBTI / SBTi 消歧，并明确题库与测试页关系。",
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
