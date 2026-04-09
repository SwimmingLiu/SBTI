# PR3 Capture And Deploy Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 用浏览器自动化抓取原站所有可达结果，与本地复刻站逐一对照，并把项目发布到 Vercel。

**Architecture:** 增加场景构造模块，把 25 个常规人格 + `DRUNK` + `HHHH` 统一表示为可执行答题场景；使用 Playwright 脚本驱动远端站和本地站真实完成答题、进入结果页、导出截图和 JSON 摘要；最后接入 Vercel CLI 完成生产部署。

**Tech Stack:** Next.js, TypeScript, Playwright, tsx, Vercel CLI

---

### Task 1: 构造全结果场景并写失败测试

**Files:**
- Create: `src/lib/sbti-scenarios.ts`
- Modify: `tests/unit/sbti-engine.test.ts`

- [ ] 先写 `buildResultScenarios` 的失败测试
- [ ] 验证场景集中包含全部常规人格、`DRUNK`、`HHHH`
- [ ] 跑 `npx vitest run tests/unit/sbti-engine.test.ts` 看红灯

### Task 2: 实现浏览器抓取脚本

**Files:**
- Create: `scripts/capture-remote-results.ts`
- Create: `scripts/capture-local-results.ts`
- Modify: `package.json`
- Modify: `src/components/sbti/quiz-screen.tsx`
- Modify: `src/components/sbti/result-screen.tsx`

- [ ] 用稳定 DOM id / selector 对齐原站与本地站
- [ ] 用 Playwright 真实完成每个场景的答题过程
- [ ] 抽取结果文本、图片 src、维度说明并保存为 JSON
- [ ] 保存每个结果页截图

### Task 3: 产出远端 / 本地对照证据

**Files:**
- Create: `research/original/results/*.json`
- Create: `research/original/results/*.png`
- Create: `research/local/results/*.json`
- Create: `research/local/results/*.png`

- [ ] 运行远端抓取脚本
- [ ] 运行本地抓取脚本
- [ ] 检查 27 个结果文件是否齐全
- [ ] 抽样核对关键字段一致性

### Task 4: 部署与发布 PR3

**Files:**
- Modify: `README.md`
- Create: `.vercel/`（如 CLI 自动生成且必须保留）

- [ ] 安装 `tsx` 和 `vercel`
- [ ] 跑 `npm run lint`、`npx vitest run`、`npx playwright test`、`npm run build`
- [ ] 推送 `codex/pr-3-capture-and-deploy`
- [ ] 创建 PR、`@copilot review`
- [ ] 如无 review 线程则合并
- [ ] 使用 Vercel CLI 部署到生产环境
