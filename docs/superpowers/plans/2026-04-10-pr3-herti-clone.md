# PR3 HERTI Clone Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 完整接入 HERTI 题库，复刻 20 题逐步答题体验、16 个人格原型结果页和结果关系卡，并提取所有可达结果证据。

**Architecture:** HERTI 维持原站的“封面 → 单题作答 → loading → 结果长卷”交互；匹配逻辑按原站的向量归一化 + 马氏距离实现；结果抓取脚本通过求解每个原型的可达答案集后再用 Playwright 浏览器验证。

**Tech Stack:** Next.js App Router, React, TypeScript, Playwright

---

### Task 1: 整理 HERTI 研究材料

**Files:**
- Create: `research/herti/raw/index.html`
- Create: `research/herti/raw/headers.txt`
- Create: `research/herti/results/`

- [ ] 校验 HERTI 入口 HTML 已归档
- [ ] 提取 20 题、16 个人格原型和协方差逆矩阵
- [ ] 明确远端页面没有额外结果图片资源，结果以排版和文本为主

### Task 2: 实现 HERTI 数据与匹配引擎

**Files:**
- Create: `src/features/herti/data.ts`
- Create: `src/features/herti/engine.ts`
- Create: `src/features/herti/types.ts`

- [ ] 本地化 16 个人格原型数据
- [ ] 实现 `normalize`、`mahalanobis`、`matchPersona`
- [ ] 为 16 个主人格各自求出至少一个可复现实验场景

### Task 3: 实现 HERTI 页面

**Files:**
- Create: `src/app/tests/herti/page.tsx`
- Create: `src/features/herti/herti-app.tsx`
- Create: `src/features/herti/herti-result.tsx`

- [ ] 复刻封面页、单题推进、loading 屏和结果长卷
- [ ] 保留镜像人格 / 反面人格卡片
- [ ] 在移动端保持可读性和长页节奏

### Task 4: 浏览器提取所有 HERTI 结果

**Files:**
- Create: `scripts/capture-herti-results.ts`
- Create: `tests/e2e/herti-flow.spec.ts`

- [ ] 用 Playwright 打开远端 `https://herti.netlify.app`
- [ ] 对 16 个主人格逐个自动答题并截图
- [ ] 输出 `research/herti/results/*.json` 和 `*.png`
- [ ] 增加本地 HERTI E2E，至少覆盖封面进入、答题完成、结果关系卡显示

### Task 5: 验证、提交、发 PR、请求 review

- [ ] 运行 `npx playwright test`
- [ ] 运行 `npm run package:out`
- [ ] 提交 `feat: add herti quiz and remote capture`
- [ ] 推送 `codex/pr-3-herti-clone`
- [ ] 创建 GitHub PR 并触发 `@copilot` review
- [ ] 按 review 反馈修复后合并 PR
- [ ] 合并后同步本地 `main` 并推送到 `origin main` 与 `origin main:master`
