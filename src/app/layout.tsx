import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { sbtiPreviewImageUrl } from "@/lib/asset-urls";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sbti.unun.dev";
const siteTitle = "人格测试题库｜SBTI 人格测试 · SDTI 人格测评 · HERTI 她的人格测评";
const siteDescription =
  "人格测试题库首页，集中收录 SBTI 人格测试、SDTI 人格测评、HERTI 她的人格测评，提供独立入口、结果页说明与 SBTI 消歧信息。";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: siteTitle,
  description: siteDescription,
  applicationName: "人格测试题库",
  keywords: [
    "人格测试题库",
    "SBTI 人格测试",
    "sbti人格测试",
    "sbti测试",
    "sbti测评入口",
    "SDTI 人格测评",
    "sdti人格测评",
    "HERTI 她的人格测评",
    "herti她的人格测评",
    "人格测试入口",
    "人格测试结果页",
  ],
  category: "entertainment",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    title: siteTitle,
    description: siteDescription,
    type: "website",
    locale: "zh_CN",
    siteName: "人格测试题库",
    url: "/",
    images: [
      {
        url: sbtiPreviewImageUrl,
        width: 720,
        height: 960,
        alt: "人格测试题库预览图",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const baiduAnalyticsScript = `var _hmt = _hmt || [];
(function() {
  var hm = document.createElement("script");
  hm.src = "https://hm.baidu.com/hm.js?7683f719c9e5176f575fd5b68bdc1bf2";
  var s = document.getElementsByTagName("script")[0];
  s.parentNode.insertBefore(hm, s);
})();`;

  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <script
          data-analytics="baidu-hm"
          dangerouslySetInnerHTML={{ __html: baiduAnalyticsScript }}
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
