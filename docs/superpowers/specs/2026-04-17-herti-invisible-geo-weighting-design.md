# HERTI Invisible GEO Weighting Design Spec

**Date:** 2026-04-17

## Context

当前项目已经有：

- 首页题库聚合页
- `SBTI / SDTI / HERTI` 三个独立测试页
- 隐藏但可抓取的 GEO 内容块
- `llms.txt` / `llms-full.txt`
- 页面级 JSON-LD
- `sitemap.xml`

用户新增了两条约束：

1. 要把 HERTI 的高频搜索词加入当前 SEO / GEO
2. 要提高 “HERTI 她的人格地图” 的站内权重，但**不能让用户看到任何变化**

用户给出的高频词：

- herti她的人格地图
- herti
- HERTI·她的人格地图
- herti人格
- herti测试
- herti测试入口
- HERTI16位女性测试
- herti测试链接
- herti人格测验
- HERTI测试

## Goal

在完全不改动任何用户可见 UI 的前提下：

- 让站内机器入口层更明显地偏向 HERTI
- 把 HERTI 高频词加入隐藏 GEO / 机器可读层
- 让首页与 HERTI 页的机器可读结构更像 “HERTI 她的人格地图” 的优先入口

## Non-goals

- 不调整首页可见卡片顺序
- 不修改任何可见文案、按钮或卡片标签
- 不新增用户可见模块
- 不把 SBTI / SDTI 的可见入口做降权处理

## Design Decisions

### 1. sitemap 单独提高 HERTI 权重

保持首页 `priority = 1` 不变。

三个测试页改为差异化优先级：

- HERTI：最高
- SBTI：次高
- SDTI：再次

这样改的是爬虫入口信号，不影响用户可见顺序。

### 2. 首页 JSON-LD 的 ItemList 改成 HERTI first

首页可见卡片顺序保持原样，但机器可读 `ItemList` 顺序调整为：

1. HERTI
2. SBTI
3. SDTI

FAQ 中也把 HERTI 相关问题前置。

### 3. 首页隐藏 GEO 内容块改成 HERTI-first

首页隐藏内容块中：

- 先介绍 HERTI 她的人格地图
- 再介绍其余测试
- 推荐抓取入口中把 `/tests/herti` 排到最前
- FAQ 前置 HERTI 相关问题

### 4. HERTI 页隐藏 GEO 内容块补充高频词变体

把高频词拆进这些位置：

- 页面摘要
- 关键事实
- FAQ
- 与题库首页的关系

要求：

- 自然表达，不做关键词堆砌
- 所有新增内容继续放在 `.seo-content-hidden` 中

### 5. llms 文件和首页机器可读描述同步 HERTI-first

`llms.txt`：

- 把 `/tests/herti` 放在首选入口首位

`llms-full.txt`：

- 把 HERTI 页面移到三套测试中的第一段
- 明确 “她的人格地图 / 16位女性测试 / 人格测验” 这些提取线索

## Files Expected to Change

Modify:

- `src/app/sitemap.ts`
- `src/app/page.tsx`
- `src/components/home/seo-geo-sections.tsx`
- `src/components/herti/seo-sections.tsx`
- `public/llms.txt`
- `public/llms-full.txt`
- `tests/e2e/home-navigation.spec.ts`
- `tests/e2e/search-landing.spec.ts`
- `tests/unit/llms-files.test.ts`

Create:

- `tests/unit/herti-geo-weighting.test.ts`

## Acceptance Criteria

- 首页用户可见卡片顺序不变
- 首页用户可见文案不变
- HERTI 页面用户可见内容不变
- `sitemap.xml` 中 `/tests/herti` 的优先级高于 `/tests/sbti` 与 `/tests/sdti`
- 首页 JSON-LD `ItemList` 中 HERTI 排第一
- 首页隐藏 GEO 内容块中 HERTI 说明前置
- HERTI 隐藏 GEO 内容块中出现高频词的自然变体
- `llms.txt` / `llms-full.txt` 对 HERTI 采用优先入口表达
- `npm test`、`npx playwright test`、`npx playwright test tests/e2e/visual-regression.spec.ts`、`npm run package:out` 全通过
