# PR1 Quiz Flow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 建立 Next.js 工程骨架，把题目数据和图片资源迁入本地，并交付可运行的首页 + 答题页流程。

**Architecture:** 先用脚手架建立前端工程；把页面数据迁入 `src/lib`，图片迁入 `public/assets/original`；以纯客户端状态驱动 Intro/Quiz 两屏切换，并复刻题目随机插入和隐藏题显隐。

**Tech Stack:** Next.js, React, TypeScript, Tailwind CSS, Vitest, Playwright

---

### Task 1: 初始化工程与依赖

**Files:**
- Create: `package.json`
- Create: `src/app/layout.tsx`
- Create: `src/app/page.tsx`
- Create: `playwright.config.ts`
- Create: `vitest.config.ts`

- [ ] 生成 Next.js App Router + Tailwind 脚手架
- [ ] 安装 Vitest / Playwright 依赖
- [ ] 跑 `npm run lint` 验证基线

### Task 2: 本地化页面数据与图片

**Files:**
- Create: `src/lib/sbti-data.ts`
- Create: `public/assets/original/sbti/*`
- Create: `scripts/extract-remote-assets.mjs`

- [ ] 编写资源抓取脚本
- [ ] 下载 `TYPE_IMAGES` 中全部图片
- [ ] 将题目数据、类型库、pattern、维度解释整理为 TypeScript 常量

### Task 3: 先写失败测试，再实现题目流程

**Files:**
- Create: `tests/unit/sbti-engine.test.ts`
- Create: `tests/e2e/quiz-flow.spec.ts`
- Create: `src/lib/sbti-engine.ts`
- Create: `src/components/sbti/intro-screen.tsx`
- Create: `src/components/sbti/question-card.tsx`
- Create: `src/components/sbti/quiz-screen.tsx`
- Modify: `src/app/page.tsx`

- [ ] 先写 `sumToLevel` / `getVisibleQuestions` 失败测试
- [ ] 实现最小题目流程逻辑并让单测转绿
- [ ] 先写从首页进入答题页的 Playwright 失败测试
- [ ] 实现 Intro / Quiz UI、进度条、随机插入题和隐藏题
- [ ] 跑 `npm run lint`、`npx vitest run`、`npx playwright test tests/e2e/quiz-flow.spec.ts`

### Task 4: 发布 PR1

**Files:**
- Modify: `README.md`

- [ ] 创建 `codex/pr-1-quiz-flow`
- [ ] 提交并推送
- [ ] 创建 PR
- [ ] `@copilot review`
- [ ] 修复 review 反馈并合并
