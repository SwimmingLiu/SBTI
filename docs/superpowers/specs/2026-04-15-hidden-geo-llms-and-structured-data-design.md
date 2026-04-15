# Hidden GEO llms.txt and Structured Data Design Spec

**Date:** 2026-04-15

## Context

当前项目已经具备：

- 首页与三个测试页的 metadata
- `robots.ts` 与 `sitemap.ts`
- 页面级 JSON-LD
- 通过 `.seo-content-hidden` 注入的隐藏但可抓取的 GEO 内容块

用户本轮新增了一个硬约束：

- **不允许出现任何新增的用户可见 GEO 内容**
- 只允许做视觉隐藏、但保留在 DOM 中供爬虫和答案引擎抓取的 GEO 强化

当前已确认的缺口：

1. 项目没有 `llms.txt` / `llms-full.txt`
2. 现有隐藏 GEO 内容块存在，但结构还不够统一，首页与三个测试页的“摘要 / 关键事实 / FAQ / 页面关系”信号不够整齐
3. 页面级 JSON-LD 已存在，但还缺少与隐藏 GEO 内容块更强的一致性约束

## Goal

在**完全不改变用户可见界面**的前提下：

- 为站点新增 `llms.txt` 与 `llms-full.txt`
- 强化首页与三个测试页的隐藏 GEO 内容块
- 保持 metadata、隐藏内容块、JSON-LD 三者语义一致
- 让导出产物在 discovery、machine readability、answer extraction 三层都有更强 GEO 信号

## Non-goals

- 不新增任何可见摘要、FAQ、导语、模块或卡片
- 不改首页和测试页现有视觉布局
- 不新增新的测试品类
- 不引入 CMS、服务端或数据库

## Design Decisions

### 1. 使用静态 public 文件交付 llms.txt

新增：

- `public/llms.txt`
- `public/llms-full.txt`

原因：

- 当前项目是 `output: "export"`
- 放在 `public/` 最稳，最终导出产物中会直接得到 `/llms.txt` 与 `/llms-full.txt`
- 不需要额外路由逻辑，也不影响页面可见 UI

### 2. 保留现有 `.seo-content-hidden` 模式，不引入任何可见 GEO 模块

现有实现已经满足：

- 不使用 `display: none`
- 不使用 `visibility: hidden`
- DOM 中仍保留真实文本

本轮只做内容结构升级，不改显示策略。

### 3. 隐藏 GEO 内容块统一为“摘要 + 关键事实 + FAQ + 页面关系”

首页隐藏块统一包含：

- 页面摘要
- SBTI / SBTi 消歧
- 三套测试差异说明
- 题库与子页面关系
- FAQ

三个测试页隐藏块统一包含：

- 页面摘要
- 关键事实（题量 / 维度 / 结果机制）
- 适合谁做
- 与其他测试的区别
- 与题库首页的关系
- FAQ

这样可以让答案引擎更稳定地抽出：

- 这是什么页面
- 有什么核心特征
- 与其他页面是什么关系

### 4. JSON-LD 只做“一致性增强”，不盲目扩类型

保留现有 page-level schema 组合：

- 首页：`CollectionPage`、`ItemList`、`BreadcrumbList`、`FAQPage`
- SBTI 页：`WebPage`、`HowTo`、`FAQPage`、`BreadcrumbList`
- SDTI / HERTI 页：`WebPage`、`FAQPage`、`BreadcrumbList`

本轮只做：

- 文案与隐藏 GEO 内容块对齐
- 页面语义描述更精确
- 避免 JSON-LD、metadata、隐藏文本三套说法互相漂移

### 5. llms.txt 明确页面提取顺序和站点关系

`llms.txt` 负责给出：

- 站点定位
- 首选入口
- 页面类型
- 推荐抓取顺序

`llms-full.txt` 负责给出：

- 首页与三个测试页的用途
- 每个页面的重要信号
- canonical 模式
- FAQ / 摘要 / 结果说明的提取优先级
- `SBTI` 与 `SBTi` 的消歧说明

## Files Expected to Change

Create:

- `public/llms.txt`
- `public/llms-full.txt`

Modify:

- `src/components/home/seo-geo-sections.tsx`
- `src/components/sbti/seo-sections.tsx`
- `src/components/sdti/seo-sections.tsx`
- `src/components/herti/seo-sections.tsx`
- `src/app/page.tsx`
- `src/app/tests/sbti/page.tsx`
- `src/app/tests/sdti/page.tsx`
- `src/app/tests/herti/page.tsx`

## Acceptance Criteria

- 导出产物中存在 `/llms.txt` 与 `/llms-full.txt`
- 首页和三个测试页继续保持**无新增可见 GEO 内容**
- 首页和三个测试页的隐藏 GEO 内容块被统一强化
- metadata、JSON-LD、隐藏 GEO 内容在页面语义上保持一致
- `npm test` 通过
- `npx playwright test` 通过
- `npx playwright test tests/e2e/visual-regression.spec.ts` 通过
- `npm run package:out` 通过
