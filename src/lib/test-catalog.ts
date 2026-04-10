export type TestSlug = "sbti" | "sdti" | "herti";

export type TestCatalogEntry = {
  accent: string;
  description: string;
  href: string;
  name: string;
  questionCount: number;
  resultCount: number;
  slug: TestSlug;
  status: "live" | "planned";
  tagline: string;
  tags: string[];
};

export const testCatalog: TestCatalogEntry[] = [
  {
    accent: "from-[#6c8d71] to-[#4d6a53]",
    description:
      "已完成复刻的原始题库，保留 31 题、15 维度、结果图与隐藏机制。",
    href: "/tests/sbti",
    name: "SBTI 人格测试",
    questionCount: 31,
    resultCount: 27,
    slug: "sbti",
    status: "live",
    tagline: "绿色系 · 图片结果 · 已上线",
    tags: ["现有题库", "结果分享", "隐藏人格"],
  },
  {
    accent: "from-[#4a4a4a] to-[#1f1f1f]",
    description:
      "冷灰纸面风格的新题库，32 题、6 个维度、9 类结果，含 Feminist 隐藏结局。",
    href: "/tests/sdti",
    name: "SDTI 人格测试",
    questionCount: 32,
    resultCount: 9,
    slug: "sdti",
    status: "live",
    tagline: "黑白纸面感 · 隐藏结果图 · 已上线",
    tags: ["新题库", "维度条", "隐藏结局"],
  },
  {
    accent: "from-[#9d8d74] to-[#645846]",
    description:
      "文学长卷式人格地图，20 题、16 位女性原型、镜像人格与反面人格关系卡。",
    href: "/tests/herti",
    name: "HERTI 她的人格地图",
    questionCount: 20,
    resultCount: 16,
    slug: "herti",
    status: "planned",
    tagline: "米色文学风 · 长卷结果页 · 接入中",
    tags: ["新题库", "马氏距离", "镜像关系"],
  },
];

export function getTestCatalogEntry(slug: TestSlug) {
  return testCatalog.find((entry) => entry.slug === slug) ?? null;
}
