import type { Metadata } from "next";
import Link from "next/link";

import { SdtiApp } from "@/features/sdti/sdti-app";

const siteTitle = "SDTI 人格测试｜SDTI 测评｜SDTI 结果";
const siteDescription =
  "SDTI 人格测试在线入口，复刻 32 题、6 维度和隐藏 Feminist 结果，支持查看维度百分比、结果文案与结果图。";

export const metadata: Metadata = {
  title: siteTitle,
  description: siteDescription,
  alternates: {
    canonical: "/tests/sdti",
  },
};

export default function SdtiPage() {
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
      <SdtiApp />
    </>
  );
}
