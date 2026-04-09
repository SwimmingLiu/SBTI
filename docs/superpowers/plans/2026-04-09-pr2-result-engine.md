# PR2 Result Engine Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 交付完整结果判定引擎和结果页，让本地站可根据答题结果渲染与原站一致的类型、文案、图片和十五维说明。

**Architecture:** 在 `src/lib/sbti-engine.ts` 中补齐纯函数化结果计算逻辑；页面端增加 `result-screen`、`dimension-list` 组件，通过同一份 `answers` 状态在 Quiz/Result 之间切换；先用单元测试锁定常规人格、`DRUNK` 和 `HHHH` 行为，再用 Playwright 验证结果页渲染。

**Tech Stack:** Next.js, React, TypeScript, Vitest, Playwright

---

### Task 1: 为结果引擎写失败测试

**Files:**
- Modify: `tests/unit/sbti-engine.test.ts`
- Modify: `src/lib/sbti-engine.ts`

- [ ] 先写 `computeResult` 对常规人格精确命中的失败测试
- [ ] 先写 `DRUNK` 隐藏人格失败测试
- [ ] 先写 `HHHH` 兜底人格失败测试
- [ ] 跑 `npx vitest run tests/unit/sbti-engine.test.ts` 看红灯

### Task 2: 实现结果引擎

**Files:**
- Modify: `src/lib/sbti-engine.ts`
- Modify: `src/lib/sbti-data.ts`

- [ ] 实现维度分数累计
- [ ] 实现 `L/M/H` 向量计算
- [ ] 实现 pattern 距离 / similarity 计算
- [ ] 实现 `DRUNK`、`HHHH` 特判和结果对象
- [ ] 跑单测转绿

### Task 3: 为结果页写失败 E2E

**Files:**
- Create: `tests/e2e/result-screen.spec.ts`
- Create: `src/components/sbti/result-screen.tsx`
- Create: `src/components/sbti/dimension-list.tsx`
- Modify: `src/components/sbti/sbti-app.tsx`

- [ ] 先写完整答题后能进入结果页的 Playwright 失败测试
- [ ] 验证结果图、主类型标题、友情提示、维度列表字段
- [ ] 跑 `npx playwright test tests/e2e/result-screen.spec.ts --project=chromium` 看红灯

### Task 4: 实现结果页并发布 PR2

**Files:**
- Modify: `src/components/sbti/quiz-screen.tsx`
- Modify: `src/components/sbti/sbti-app.tsx`
- Modify: `README.md`

- [ ] 接入结果页和重新测试 / 回到首页操作
- [ ] 跑 `npm run lint`、`npx vitest run`、`npx playwright test tests/e2e/quiz-flow.spec.ts tests/e2e/result-screen.spec.ts --project=chromium`、`npm run build`
- [ ] 推送 `codex/pr-2-result-engine`
- [ ] 创建 PR、`@copilot review`
- [ ] 如有 review 建议则修复并合并
