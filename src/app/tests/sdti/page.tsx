import type { Metadata } from "next";
import Link from "next/link";

import { SdtiSeoSections } from "@/components/sdti/seo-sections";
import { SdtiApp } from "@/features/sdti/sdti-app";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sbti.unun.dev";
const siteTitle = "SDTI 人格测评｜SDTI 测试入口｜SDTI 结果说明";
const siteDescription =
  "SDTI 人格测评在线入口，复刻 32 道题、6 个维度、9 类结果和隐藏 Feminist 结局，适合搜索 sdti人格测评 的用户直接查看。";

export const metadata: Metadata = {
  title: siteTitle,
  description: siteDescription,
  alternates: {
    canonical: "/tests/sdti",
  },
  keywords: [
    "SDTI 人格测评",
    "sdti人格测评",
    "SDTI 测试入口",
    "SDTI 结果说明",
  ],
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    locale: "zh_CN",
    siteName: "SDTI 人格测评",
    type: "website",
    url: "/tests/sdti",
  },
  twitter: {
    card: "summary",
    title: siteTitle,
    description: siteDescription,
  },
};

export default function SdtiPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      description: siteDescription,
      name: "SDTI 人格测评",
      url: `${siteUrl}/tests/sdti`,
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "SDTI 人格测评是什么？",
          acceptedAnswer: {
            "@type": "Answer",
            text: "SDTI 是冷灰纸面风格的人格测评，复刻 32 道题、6 个维度、9 类结果和 Feminist 隐藏结局。",
          },
        },
        {
          "@type": "Question",
          name: "SDTI 结果页会展示什么？",
          acceptedAnswer: {
            "@type": "Answer",
            text: "结果页会展示结果名称、结果文案、维度百分比、结果注释，以及隐藏结局提示。",
          },
        },
      ],
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
        {
          "@type": "ListItem",
          item: `${siteUrl}/tests/sdti`,
          name: "SDTI 人格测评",
          position: 2,
        },
      ],
    },
  ];

  return (
    <>
      <div className="px-4 pt-6">
        <div className="mx-auto flex max-w-[760px] justify-start">
          <Link
            className="inline-flex items-center rounded-full border border-[#d9d9d9] bg-white px-4 py-2 text-sm text-[#666] transition hover:border-[#999] hover:text-[#111]"
            href="/"
          >
            ← 返回题库首页
          </Link>
        </div>
      </div>
      <script
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        type="application/ld+json"
      />
      <SdtiApp />
      <SdtiSeoSections />
    </>
  );
}
