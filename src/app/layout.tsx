import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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
const siteTitle = "SBTI 人格测试｜SBTI 测评｜SBTI 官网";
const siteDescription =
  "SBTI 人格测试在线入口，支持 SBTI 测试、SBTI 测评、SBTI 人格结果查看。页面覆盖 31 道题、15 个维度、27 种人格结果与隐藏人格说明，适合移动端和社交分享。";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: siteTitle,
  description: siteDescription,
  applicationName: "SBTI 人格测试",
  alternates: {
    canonical: "/",
  },
  keywords: [
    "SBTI 人格测试",
    "sbti人格测试",
    "sbti测试",
    "sbti测评",
    "sbti测评官网",
    "SBTI 官网",
    "SBTI 测试入口",
    "SBTI 27 人格",
    "SBTI 结果图",
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
    siteName: "SBTI 人格测试",
    url: "/",
    images: [
      {
        url: "/assets/original/sbti/CTRL.png",
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
    images: ["/assets/original/sbti/CTRL.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="zh-CN"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
