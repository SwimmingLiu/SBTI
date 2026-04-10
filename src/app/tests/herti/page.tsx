import type { Metadata } from "next";
import Link from "next/link";

import { HertiSeoSections } from "@/components/herti/seo-sections";
import { HertiApp } from "@/features/herti/herti-app";

export const metadata: Metadata = {
  title: "HERTI 她的人格测评｜HERTI 她的人格地图｜HERTI 测试",
  description:
    "HERTI 她的人格测评在线入口，复刻 20 道题、16 位女性原型、镜像人格与反面人格结果长卷，适合搜索 herti她的人格测评、herti人格地图 的用户访问。",
  alternates: {
    canonical: "/tests/herti",
  },
  keywords: [
    "HERTI 她的人格测评",
    "HERTI 她的人格地图",
    "herti她的人格测评",
    "herti人格地图",
    "女性人格原型测试",
  ],
};

export default function HertiPage() {
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
      <HertiApp />
      <HertiSeoSections />
    </>
  );
}
