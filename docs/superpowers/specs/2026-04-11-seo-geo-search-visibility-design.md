# SEO / GEO Search Visibility Design Spec

**Date:** 2026-04-11

## Context

当前项目已经具备多题库结构，但线上搜索表现很差。已确认两个核心问题：

1. `sbti.orangemust.com` 当前没有返回仓库最新导出产物，`/`、`/tests/sbti`、`/tests/sdti`、`/tests/herti`、`/robots.txt`、`/sitemap.xml` 都存在部署错配。
2. 现有 SEO 内容大量依赖完全隐藏的文本块，不利于用户体验，也不符合 GEO 强调的“可回答、可引用、可信源”原则。

外部证据显示：

- Bing 上 `SBTI 人格测试 / sbti人格测试 / sbti测试` 已有多个竞品通过精确题量、结果数、入口词承接占位。
- `sbti测评入口 / sbti测评官网` 被 `SBTi` 气候组织强占，说明当前站点没有完成语义消歧。
- `sdti人格测评`、`herti她的人格测评` 仍有明显占位机会。
- 用户明确本轮 **不做 FWTI**。

## Goal

在不打断当前产品体验的前提下：

- 修复生产站点与当前代码不一致的问题
- 强化首页与 `SBTI / SDTI / HERTI` 三个独立落地页的 SEO/GEO 表达
- 将纯隐藏 SEO 内容重构为真实可见但视觉弱化的答案型说明区
- 保留百度统计脚本并进入最终产物

## Non-goals

- 不新增 FWTI 页面
- 不做站外运营或外链
- 不引入 CMS、数据库、后端服务

## Design Decisions

### 1. 首页承担聚合与消歧角色

首页负责：

- 作为“人格测试题库”总站入口
- 聚合 `SBTI / SDTI / HERTI`
- 显式说明这里的 `SBTI` 是人格测试，不是 `Science Based Targets initiative (SBTi)`

首页 title、description、keywords 与 JSON-LD 统一围绕三套已上线测试，不再保留 FWTI 文案。

### 2. 三个测试页作为独立搜索承接页

- `/tests/sbti` 承接 `sbti测试 / sbti测评入口 / sbti测评官网`
- `/tests/sdti` 承接 `sdti人格测评`
- `/tests/herti` 承接 `herti她的人格测评 / herti人格地图`

每个页面都明确回答：

- 这是什么测试
- 多少题 / 多少维度 / 多少结果
- 结果页展示什么
- 谁适合做

### 3. 从隐藏 SEO 内容切换到可见答案区

不再使用 `aria-hidden="true"` + `seo-content-hidden` 作为核心 SEO 策略。

改为：

- 页面下半区增加弱化的说明卡片
- 短段落 + 事实块 + FAQ
- 对用户可见，但不抢主流程焦点

### 4. 结构化数据与元数据

首页：

- `CollectionPage`
- `ItemList`
- `FAQPage`
- `BreadcrumbList`

测试页：

- `WebPage`
- `FAQPage`
- `HowTo`（SBTI）
- `BreadcrumbList`

### 5. 部署策略

先用脚本验证生产首页、测试页、robots、sitemap 是否返回正确内容，再发布新版生产部署。

如果自定义域名不在当前账号或无法重新绑定，需要明确记录为外部基础设施阻塞，而不是把旧线上结果误判为代码问题。

## Acceptance Criteria

- 首页和三个测试页拥有真实可见的答案型说明区
- 首页、SBTI、SDTI、HERTI 的 metadata 与结构化数据匹配目标关键词
- `SBTI` 页面明确完成 `SBTi` 消歧
- 本地 `npm test`、`npx playwright test`、`npx playwright test tests/e2e/visual-regression.spec.ts`、`npm run package:out` 全通过
- Vercel 生产部署更新成功
- 如果 `sbti.orangemust.com` 仍无法切到新部署，明确给出外部域名权限阻塞证据
