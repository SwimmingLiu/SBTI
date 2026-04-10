import type { Metadata } from "next";

import { TestHome } from "@/components/home/test-home";
import { testCatalog } from "@/lib/test-catalog";

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
        "聚合 SBTI 人格测试、SDTI 人格测评、HERTI 她的人格测评等多套娱乐向人格测试，并为 FWTI 恋爱废物人格测评预留扩展位。",
      name: "人格测试题库",
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement: testCatalog.map((entry, index) => ({
        "@type": "ListItem",
        name: entry.name,
        position: index + 1,
        url: entry.href,
      })),
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
            text: "当前已上线 SBTI 人格测试、SDTI 人格测评、HERTI 她的人格测评；FWTI 恋爱废物人格测评正在整理接入。",
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
