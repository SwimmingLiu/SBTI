# PR1 Multi-Quiz Shell Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 把当前单入口 SBTI 改造成多题库首页，并把 SBTI 迁移到独立测试入口 `/tests/sbti`。

**Architecture:** 新增轻量题库注册表与首页卡片；保留现有 SBTI 组件和算法，只调整入口路由、元数据和导航；为后续 SDTI/HERTI 预留统一入口结构，但不提前抽象结果引擎。

**Tech Stack:** Next.js App Router, React, TypeScript, Playwright

---

### Task 1: 写设计与路线文档

**Files:**
- Create: `docs/superpowers/specs/2026-04-10-multi-quiz-platform-design.md`
- Create: `docs/superpowers/plans/2026-04-10-pr1-multi-quiz-shell.md`
- Create: `docs/superpowers/plans/2026-04-10-pr2-sdti-clone.md`
- Create: `docs/superpowers/plans/2026-04-10-pr3-herti-clone.md`

- [ ] 写总设计文档，记录多题库方案、远端取证结论和 PR 划分
- [ ] 写 PR1/PR2/PR3 的实施计划，作为后续实现基准

### Task 2: 建立首页与题库注册表

**Files:**
- Create: `src/lib/test-catalog.ts`
- Create: `src/components/home/test-entry-card.tsx`
- Create: `src/components/home/test-home.tsx`
- Modify: `src/app/page.tsx`
- Modify: `src/app/layout.tsx`

- [ ] 增加题库元数据：slug、名称、简介、题量、结果数、标签、入口路径
- [ ] 把根路由改成多题库首页
- [ ] 保证首页至少展示 SBTI / SDTI / HERTI 三张入口卡片

### Task 3: 迁移 SBTI 到独立入口

**Files:**
- Create: `src/app/tests/sbti/page.tsx`
- Modify: `src/components/sbti/intro-screen.tsx`
- Modify: `src/components/sbti/sbti-app.tsx`
- Modify: `src/app/sitemap.ts`
- Modify: `src/app/robots.ts`

- [ ] 新建 `/tests/sbti` 页面并承载现有 `SbtiApp`
- [ ] 保留当前小程序兼容逻辑，不回滚工作区已有的入口隐藏行为
- [ ] 在 SBTI 页增加“返回题库首页”的可发现入口

### Task 4: 先写失败的 E2E，再让导航转绿

**Files:**
- Create: `tests/e2e/home-navigation.spec.ts`
- Modify: `tests/e2e/quiz-flow.spec.ts`

- [ ] 新增首页导航测试：根页展示三张卡片，点击 SBTI 能进入 `/tests/sbti`
- [ ] 调整既有 SBTI E2E，使其从新路径运行
- [ ] 跑 `npx playwright test` 直到首页与 SBTI 路由都通过

### Task 5: 验证、提交、发 PR、请求 review

**Files:**
- Modify: `README.md`

- [ ] 运行 `npx playwright test`
- [ ] 运行 `npm run package:out`
- [ ] 提交 `feat: add multi-quiz home and route sbti separately`
- [ ] 推送 `codex/pr-1-multi-quiz-shell`
- [ ] 创建 GitHub PR 并触发 `@copilot` review
- [ ] 按 review 反馈修复后合并 PR
- [ ] 合并后同步本地 `main` 并推送到 `origin main` 与 `origin main:master`
