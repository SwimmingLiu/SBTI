import type { Metadata } from "next";
import Link from "next/link";

import { HertiSeoSections } from "@/components/herti/seo-sections";
import { HertiApp } from "@/features/herti/herti-app";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sbti.orangemust.com";
const siteTitle = "HERTI 她的人格测评｜HERTI 人格地图｜结果说明";
const siteDescription =
  "HERTI 她的人格测评在线入口，复刻 20 道题、16 位女性原型、镜像人格和反面人格关系卡，适合搜索 herti她的人格测评 的用户访问。";

export const metadata: Metadata = {
  title: siteTitle,
  description: siteDescription,
  alternates: {
    canonical: "/tests/herti",
  },
  keywords: [
    "HERTI 她的人格测评",
    "herti她的人格地图",
    "herti",
    "HERTI·她的人格地图",
    "herti人格",
    "herti测试",
    "herti测试入口",
    "HERTI16位女性测试",
    "herti测试链接",
    "herti人格测验",
    "HERTI测试",
    "herti她的人格测评",
    "herti人格地图",
    "HERTI 结果说明",
  ],
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    locale: "zh_CN",
    siteName: "HERTI 她的人格测评",
    type: "website",
    url: "/tests/herti",
  },
  twitter: {
    card: "summary",
    title: siteTitle,
    description: siteDescription,
  },
};

export default function HertiPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      description:
        "HERTI 她的人格测评在线入口，适合搜索 herti她的人格地图、HERTI·她的人格地图、herti测试入口、HERTI16位女性测试 的用户访问，重点说明原型结构、镜像人格和反面人格关系卡。",
      name: "HERTI 她的人格测评",
      url: `${siteUrl}/tests/herti`,
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "HERTI测试入口在哪里？",
          acceptedAnswer: {
            "@type": "Answer",
            text: "当前页面就是 HERTI测试入口，也可以视为 herti测试链接、herti人格测验 与 herti她的人格地图 的统一落地页。",
          },
        },
        {
          "@type": "Question",
          name: "HERTI 她的人格测评是什么？",
          acceptedAnswer: {
            "@type": "Answer",
            text: "HERTI 是一套文学风格的人格测评，也常被搜索为 HERTI·她的人格地图、HERTI16位女性测试 与 herti人格。",
          },
        },
        {
          "@type": "Question",
          name: "HERTI 结果页会展示什么？",
          acceptedAnswer: {
            "@type": "Answer",
            text: "结果页会展示主人格、epigraph、persona 段落、灵魂原型、镜像人格和反面人格关系卡。",
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
          item: `${siteUrl}/tests/herti`,
          name: "HERTI 她的人格测评",
          position: 2,
        },
      ],
    },
  ];

  return (
    <>
      <div className="bg-[#f4f1ea] px-4 pt-6">
        <div className="mx-auto flex max-w-[520px] justify-start">
          <Link
            className="inline-flex items-center rounded-full border border-[#d9d0bd] bg-[#faf7f0] px-4 py-2 text-sm text-[#6a5f4c] transition hover:border-[#8a7d6a] hover:text-[#1a1a1a]"
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
      <HertiApp />
      <HertiSeoSections />
    </>
  );
}
