# SEO GEO Search Visibility Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 修复生产站点与当前仓库产物不一致的问题，并将首页、SBTI、SDTI、HERTI 四个页面升级为搜索引擎与 AI 都更容易理解和引用的落地页。

**Architecture:** 保持 Next.js 静态导出模式不变；新增统一的答案型说明组件；分别重写首页与三个测试页的 metadata、JSON-LD、FAQ 和事实块；加入生产校验脚本；完成测试、PR、review、合并、部署与 gitee 同步。

**Tech Stack:** Next.js App Router, React 19, TypeScript, Tailwind CSS 4, Vitest, Playwright, Vercel CLI, GitHub CLI

---

### Task 1: 生产校验工具

**Files:**
- Modify: `package.json`
- Create: `src/lib/production-verification.ts`
- Create: `scripts/verify-production-pages.ts`
- Create: `tests/unit/production-verification.test.ts`

- [ ] 新增生产检查 helper 与脚本
- [ ] 用单测覆盖 content-type 和关键文本校验逻辑
- [ ] 运行 `npm test -- tests/unit/production-verification.test.ts`
- [ ] 运行 `npm run verify:prod` 记录线上失败基线
- [ ] 运行 `npm run package:out` 校验本地导出无误

### Task 2: 可见答案区组件

**Files:**
- Create: `src/components/shared/answer-rich-panel.tsx`
- Modify: `src/components/home/seo-geo-sections.tsx`
- Modify: `src/components/sbti/seo-sections.tsx`
- Modify: `src/components/sdti/seo-sections.tsx`
- Modify: `src/components/herti/seo-sections.tsx`

- [ ] 将首页与三套测试页的隐藏 SEO 文本改为可见说明区
- [ ] 删除 FWTI 文案
- [ ] 首页增加 SBTI/SBTi 消歧说明
- [ ] 运行新增落地页 E2E，确认说明区真实可见

### Task 3: 首页 metadata 与卡片文案

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/lib/test-catalog.ts`

- [ ] 收紧站点级 title / description / keywords
- [ ] 首页 JSON-LD 改成三套已上线测试
- [ ] 首页卡片名称改为 `SDTI 人格测评`、`HERTI 她的人格测评`
- [ ] 不再保留 FWTI 相关关键词

### Task 4: SBTI 落地页

**Files:**
- Modify: `src/app/tests/sbti/page.tsx`
- Modify: `tests/e2e/quiz-flow.spec.ts`

- [ ] 将标题改为“测评入口 / 结果说明”导向
- [ ] 补齐 `WebPage` / `FAQPage` / `HowTo` / `BreadcrumbList`
- [ ] 增加 `Science Based Targets initiative` 消歧
- [ ] 调整旧 E2E 预期到新行为

### Task 5: SDTI / HERTI 落地页

**Files:**
- Modify: `src/app/tests/sdti/page.tsx`
- Modify: `src/app/tests/herti/page.tsx`
- Modify: `tests/e2e/herti-flow.spec.ts`

- [ ] 补齐 SDTI / HERTI metadata、FAQ、Breadcrumb
- [ ] 强化 32 题 / Feminist、16 女性原型 / 镜像人格等事实块
- [ ] 调整 HERTI 入口 E2E 预期到更精确的 heading 匹配

### Task 6: 搜索落地页测试与视觉基线

**Files:**
- Modify: `tests/e2e/home-navigation.spec.ts`
- Create: `tests/e2e/search-landing.spec.ts`
- Update: `tests/e2e/visual-regression.spec.ts-snapshots/herti-share-dialog-chromium-darwin.png`

- [ ] 增加首页和三个测试页的搜索落地断言
- [ ] 将“隐藏 SEO 文本”测试改为“可见答案区”测试
- [ ] 更新 HERTI 分享弹窗视觉基线
- [ ] 运行完整 Playwright 套件

### Task 7: 发布与收尾

**Files:**
- Modify: `docs/superpowers/specs/2026-04-11-seo-geo-search-visibility-design.md`
- Modify: `docs/superpowers/plans/2026-04-11-seo-geo-search-visibility.md`

- [ ] 运行 `npm test`
- [ ] 运行 `npx playwright test`
- [ ] 运行 `npx playwright test tests/e2e/visual-regression.spec.ts`
- [ ] 运行 `npm run package:out`
- [ ] 推送 GitHub 分支并创建 draft PR
- [ ] 触发随机 Copilot/Claude review
- [ ] 合并 PR
- [ ] 生产部署到 Vercel
- [ ] 运行 `npm run verify:prod`
- [ ] 若 `sbti.unun.dev` 未切到新版，保留证据并同步 gitee
