import type { Metadata } from "next";
import Link from "next/link";

import { SeoSections } from "@/components/sbti/seo-sections";
import { SbtiApp } from "@/components/sbti/sbti-app";
import { sbtiPreviewImageUrl } from "@/lib/asset-urls";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sbti.orangemust.com";
const siteTitle = "SBTI 人格测试｜SBTI 测评入口｜SBTI 结果说明";
const siteDescription =
  "SBTI 人格测试在线入口，支持 31 道题、15 个维度、27 种人格结果与结果图查看，适合搜索 sbti测试、sbti测评入口、sbti测评官网 的用户直接进入。";

export const metadata: Metadata = {
  title: siteTitle,
  description: siteDescription,
  alternates: {
    canonical: "/tests/sbti",
  },
  keywords: [
    "SBTI 人格测试",
    "sbti人格测试",
    "sbti测试",
    "sbti测评入口",
    "sbti测评官网",
    "SBTI 结果说明",
    "SBTI 结果图",
  ],
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    type: "website",
    locale: "zh_CN",
    siteName: "SBTI 人格测试",
    url: "/tests/sbti",
    images: [
      {
        url: sbtiPreviewImageUrl,
        width: 720,
        height: 960,
        alt: "SBTI 人格测试结果预览图",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: siteTitle,
    description: siteDescription,
    images: [sbtiPreviewImageUrl],
  },
};

export default function SbtiPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      description:
        "SBTI 人格测试在线入口，覆盖 sbti人格测试、sbti测试、sbti测评入口、sbti测评官网 等常见搜索需求。",
      name: "SBTI 人格测试",
      url: `${siteUrl}/tests/sbti`,
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
          name: "SBTI 测评入口在哪里？",
          acceptedAnswer: {
            "@type": "Answer",
            text: "当前页面就是 SBTI 测评入口，适合搜索 sbti测评官网、sbti测试、sbti测评入口 的用户直接开始答题并查看结果。",
          },
        },
        {
          "@type": "Question",
          name: "这里的 SBTI 和气候组织 SBTi 有什么区别？",
          acceptedAnswer: {
            "@type": "Answer",
            text: "这里的 SBTI 指娱乐向人格测试，不是 Science Based Targets initiative（SBTi）。本页提供的是人格测试入口、题量结构和结果说明。",
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
          item: `${siteUrl}/tests/sbti`,
          name: "SBTI 人格测试",
          position: 2,
        },
      ],
    },
  ];

  return (
    <>
      <div className="px-4 pt-6">
        <div className="mx-auto flex max-w-[980px] justify-start">
          <Link
            className="inline-flex items-center rounded-full border border-[var(--line)] bg-white px-4 py-2 text-sm text-[var(--muted)] transition hover:border-[var(--accent)] hover:text-[var(--foreground)]"
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
      <SbtiApp />
      <SeoSections />
    </>
  );
}
