# PR2 SDTI Clone Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 完整接入 SDTI 题库，复刻原站文案、结果机制、隐藏结果和结果图，并沉淀远端全结果抓取证据。

**Architecture:** SDTI 独立维护自己的题库数据、分维得分逻辑、结果条件判断和 Playwright 抓取流程；首页和路由只负责入口，不干预 SDTI 的答题/结果实现。

**Tech Stack:** Next.js App Router, React, TypeScript, Playwright

---

### Task 1: 整理 SDTI 研究材料

**Files:**
- Create: `research/sdti/raw/index.html`
- Create: `research/sdti/raw/headers.txt`
- Create: `research/sdti/results/`

- [ ] 校验 SDTI 入口 HTML 已归档
- [ ] 从源码提取题目、维度、结果分支、隐藏触发条件
- [ ] 确认唯一结果图资源与署名信息

### Task 2: 实现 SDTI 数据与引擎

**Files:**
- Create: `src/features/sdti/data.ts`
- Create: `src/features/sdti/engine.ts`
- Create: `src/features/sdti/types.ts`
- Create: `public/assets/original/sdti/feminist.webp`

- [ ] 本地化 32 题题库与 6 个维度上限
- [ ] 实现常规结果与隐藏 `Feminist` 的判断逻辑
- [ ] 为每种结果生成至少一个可复现实验场景

### Task 3: 实现 SDTI 页面

**Files:**
- Create: `src/app/tests/sdti/page.tsx`
- Create: `src/features/sdti/sdti-app.tsx`
- Create: `src/features/sdti/sdti-result.tsx`

- [ ] 复刻 SDTI 的整页答题布局、维度条和结果区
- [ ] 保留“可不答完直接提交”的交互特征
- [ ] 本地结果页展示图片、署名、文案与百分比

### Task 4: 浏览器提取所有 SDTI 结果

**Files:**
- Create: `scripts/capture-sdti-results.ts`
- Create: `tests/e2e/sdti-flow.spec.ts`

- [ ] 用 Playwright 打开远端 `https://fmnst.net`
- [ ] 对每个结果场景自动答题并截图
- [ ] 输出 `research/sdti/results/*.json` 和 `*.png`
- [ ] 增加本地 SDTI E2E，至少覆盖首页进入、隐藏结果与一个普通结果

### Task 5: 验证、提交、发 PR、请求 review

- [ ] 运行 `npx playwright test`
- [ ] 运行 `npm run package:out`
- [ ] 提交 `feat: add sdti quiz and remote capture`
- [ ] 推送 `codex/pr-2-sdti-clone`
- [ ] 创建 GitHub PR 并触发 `@copilot` review
- [ ] 按 review 反馈修复后合并 PR
- [ ] 合并后同步本地 `main` 并推送到 `origin main` 与 `origin main:master`
