# SBTI Clone Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 从空仓库构建并上线一个可在 Vercel 运行的 SBTI 人格测试克隆站，完整复刻页面结果和资源，并补齐浏览器级验证与发布流程。

**Architecture:** 使用 Next.js App Router + TypeScript + Tailwind 构建客户端测试应用；核心判定逻辑抽离为纯函数模块并通过 Vitest 验证；使用 Playwright 对参考页面和本地站做结果抓取与端到端校验；资源和运行时抓取证据单独保存在 research/original 与 public/assets/original 中。

**Tech Stack:** Next.js, React, TypeScript, Tailwind CSS, Vitest, Playwright, GitHub CLI, Vercel CLI

---

## File Structure

- Create: `docs/superpowers/specs/2026-04-09-sbti-clone-design.md`
- Create: `docs/superpowers/plans/2026-04-09-sbti-clone-implementation.md`
- Create: `research/original/`
- Create: `scripts/extract-remote-assets.mjs`
- Create: `scripts/capture-remote-results.mjs`
- Create: `scripts/capture-local-results.mjs`
- Create: `public/assets/original/sbti/`
- Create: `src/lib/sbti-data.ts`
- Create: `src/lib/sbti-engine.ts`
- Create: `src/lib/sbti-scenarios.ts`
- Create: `src/components/sbti/*`
- Create: `src/app/page.tsx`
- Create: `tests/unit/sbti-engine.test.ts`
- Create: `tests/e2e/*.spec.ts`

### Task 1: 建立基础仓库与工程骨架

**Files:**
- Create: `package.json`
- Create: `src/app/layout.tsx`
- Create: `src/app/page.tsx`
- Create: `playwright.config.ts`
- Create: `vitest.config.ts`

- [ ] **Step 1: 初始化 main 分支基础提交**

Run: `git status --short --branch`
Expected: `## No commits yet on main...`

- [ ] **Step 2: 建立 Next.js + TypeScript + Tailwind 工程**

Run: `npm create next-app@latest temp-app -- --ts --eslint --tailwind --app --src-dir --import-alias "@/*" --use-npm --yes`
Expected: 成功生成临时脚手架目录 `temp-app`

- [ ] **Step 3: 迁移脚手架文件到仓库根目录**

Run: `rsync -a temp-app/ ./`
Expected: 根目录出现 `package.json`、`src/app` 等文件

- [ ] **Step 4: 安装验证与测试依赖**

Run: `npm install -D vitest @vitest/coverage-v8 playwright @playwright/test`
Expected: `package-lock.json` 更新且退出码为 0

- [ ] **Step 5: 运行脚手架初始验证**

Run: `npm run lint`
Expected: 退出码 0

- [ ] **Step 6: 提交基础骨架**

Run: `git add . && git commit -m "chore: initialize nextjs app"`
Expected: 生成第一条有效提交

### Task 2: 抓取页面快照与结果图片

**Files:**
- Create: `research/original/SBTI.html`
- Create: `public/assets/original/sbti/*`
- Create: `scripts/extract-remote-assets.mjs`

- [ ] **Step 1: 编写远端资产抓取脚本测试**

```ts
import { describe, expect, it } from "vitest";
import { getImageUrlsFromHtml } from "@/lib/sbti-data";

describe("asset extraction", () => {
  it("extracts sbti image paths from original html", () => {
    const paths = getImageUrlsFromHtml('<script>const TYPE_IMAGES = {"CTRL":"images/sbti/CTRL.png"};</script>');
    expect(paths).toEqual(["images/sbti/CTRL.png"]);
  });
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npx vitest run tests/unit/sbti-engine.test.ts`
Expected: FAIL，提示 `getImageUrlsFromHtml` 未实现

- [ ] **Step 3: 实现最小抓取辅助函数与脚本**

```ts
export function getImageUrlsFromHtml(html: string): string[] {
  const match = html.match(/const TYPE_IMAGES = (\{[\s\S]*?\});/);
  if (!match) return [];
  const images = JSON.parse(match[1].replace(/(\w[\w!-]*)":/g, '"$1":'));
  return Object.values(images);
}
```

Run: `node scripts/extract-remote-assets.mjs`
Expected: 下载远端 HTML 与图片到本地目录

- [ ] **Step 4: 运行测试确认通过**

Run: `npx vitest run tests/unit/sbti-engine.test.ts`
Expected: PASS

- [ ] **Step 5: 提交资产抓取能力**

Run: `git add research/original public/assets/original scripts && git commit -m "feat: capture original sbti assets"`
Expected: 新提交生成

### Task 3: 先写题目流程相关失败测试

**Files:**
- Create: `tests/unit/sbti-engine.test.ts`
- Create: `src/lib/sbti-data.ts`
- Create: `src/lib/sbti-engine.ts`

- [ ] **Step 1: 写题目可见性失败测试**

```ts
it("shows drink trigger follow-up only when first drink gate answer is 3", () => {
  const visible = getVisibleQuestionIds(baseQuestionIds, { drink_gate_q1: 3 });
  expect(visible).toContain("drink_gate_q2");
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npx vitest run tests/unit/sbti-engine.test.ts -t "shows drink trigger follow-up only when first drink gate answer is 3"`
Expected: FAIL，提示 `getVisibleQuestionIds` 未定义

- [ ] **Step 3: 实现最小数据与可见性逻辑**

```ts
export function getVisibleQuestions(questionIds: string[], answers: Record<string, number>) {
  const visible = [...questionIds];
  const gateIndex = visible.indexOf("drink_gate_q1");
  if (gateIndex !== -1 && answers.drink_gate_q1 === 3) {
    visible.splice(gateIndex + 1, 0, "drink_gate_q2");
  }
  return visible;
}
```

- [ ] **Step 4: 运行测试确认通过**

Run: `npx vitest run tests/unit/sbti-engine.test.ts -t "shows drink trigger follow-up only when first drink gate answer is 3"`
Expected: PASS

- [ ] **Step 5: 补充 `sumToLevel` 与 `computeResult` 失败测试**

```ts
it("maps sum scores to L M H", () => {
  expect(sumToLevel(2)).toBe("L");
  expect(sumToLevel(4)).toBe("M");
  expect(sumToLevel(6)).toBe("H");
});
```

- [ ] **Step 6: 跑失败测试**

Run: `npx vitest run tests/unit/sbti-engine.test.ts -t "maps sum scores to L M H"`
Expected: FAIL

- [ ] **Step 7: 实现最小映射逻辑**

```ts
export function sumToLevel(score: number) {
  if (score <= 3) return "L";
  if (score === 4) return "M";
  return "H";
}
```

- [ ] **Step 8: 跑测试确认通过**

Run: `npx vitest run tests/unit/sbti-engine.test.ts -t "maps sum scores to L M H"`
Expected: PASS

- [ ] **Step 9: 提交领域基础逻辑**

Run: `git add src/lib tests/unit && git commit -m "feat: add sbti engine foundation"`
Expected: 新提交生成

### Task 4: 实现首页和题目页 UI

**Files:**
- Create: `src/components/sbti/intro-screen.tsx`
- Create: `src/components/sbti/quiz-screen.tsx`
- Create: `src/components/sbti/question-card.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: 写首页进入答题流程的 E2E 失败测试**

```ts
test("starts the quiz from intro screen", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: "开始测试" }).click();
  await expect(page.getByText(/第 1 题/)).toBeVisible();
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npx playwright test tests/e2e/quiz-flow.spec.ts --project=chromium`
Expected: FAIL，首页或题目页未实现

- [ ] **Step 3: 实现 Intro / Quiz 组件与页面状态切换**

```tsx
const [screen, setScreen] = useState<"intro" | "quiz" | "result">("intro");

return screen === "intro" ? (
  <IntroScreen onStart={() => setScreen("quiz")} />
) : (
  <QuizScreen ... />
);
```

- [ ] **Step 4: 运行 E2E 确认通过**

Run: `npx playwright test tests/e2e/quiz-flow.spec.ts --project=chromium`
Expected: PASS

- [ ] **Step 5: 提交题目流程页面**

Run: `git add src/app src/components tests/e2e && git commit -m "feat: build sbti quiz flow"`
Expected: 新提交生成

### Task 5: 实现结果页与结果图

**Files:**
- Create: `src/components/sbti/result-screen.tsx`
- Create: `src/components/sbti/dimension-list.tsx`
- Modify: `src/lib/sbti-engine.ts`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: 写结果页失败测试**

```ts
test("submits answers and renders a result card", async ({ page }) => {
  await page.goto("/");
  // 填完题后提交
  await expect(page.getByRole("img", { name: /人格结果图|CTRL|BOSS|DRUNK/ })).toBeVisible();
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npx playwright test tests/e2e/result-screen.spec.ts --project=chromium`
Expected: FAIL

- [ ] **Step 3: 完成结果算法、结果页字段映射与图片接入**

```tsx
<Image
  src={result.imageSrc}
  alt={`${result.finalType.code}（${result.finalType.cn}）`}
  width={720}
  height={960}
/>
```

- [ ] **Step 4: 运行结果页 E2E**

Run: `npx playwright test tests/e2e/result-screen.spec.ts --project=chromium`
Expected: PASS

- [ ] **Step 5: 运行单元测试**

Run: `npx vitest run`
Expected: PASS

- [ ] **Step 6: 提交结果页能力**

Run: `git add src tests && git commit -m "feat: render sbti results"`
Expected: 新提交生成

### Task 6: 通过 Playwright 抓取远端所有结果状态

**Files:**
- Create: `src/lib/sbti-scenarios.ts`
- Create: `scripts/capture-remote-results.mjs`
- Create: `scripts/capture-local-results.mjs`
- Create: `research/original/results/*.json`
- Create: `research/original/results/*.png`

- [ ] **Step 1: 写场景生成失败测试**

```ts
it("builds a deterministic scenario for each reachable result", () => {
  const scenarios = buildResultScenarios();
  expect(scenarios.some((item) => item.code === "CTRL")).toBe(true);
  expect(scenarios.some((item) => item.code === "DRUNK")).toBe(true);
  expect(scenarios.some((item) => item.code === "HHHH")).toBe(true);
});
```

- [ ] **Step 2: 运行测试确认失败**

Run: `npx vitest run tests/unit/sbti-engine.test.ts -t "builds a deterministic scenario for each reachable result"`
Expected: FAIL

- [ ] **Step 3: 实现场景生成与浏览器抓取脚本**

```ts
for (const scenario of scenarios) {
  await page.goto(remoteUrl);
  await page.evaluate((payload) => {
    Object.assign(app.answers, payload.answers);
    renderResult();
  }, scenario);
}
```

- [ ] **Step 4: 执行远端抓取**

Run: `node scripts/capture-remote-results.mjs`
Expected: 生成所有结果的截图与 JSON 摘要

- [ ] **Step 5: 执行本地抓取**

Run: `node scripts/capture-local-results.mjs`
Expected: 生成本地复刻结果截图与 JSON 摘要

- [ ] **Step 6: 提交浏览器抓取能力**

Run: `git add scripts src/lib research/original/results && git commit -m "feat: add sbti browser capture workflows"`
Expected: 新提交生成

### Task 7: 发布前验收、PR、Review、部署

**Files:**
- Modify: `README.md`
- Modify: `package.json`
- Create: `.github/`（如需要）

- [ ] **Step 1: 运行完整验证**

Run: `npm run lint && npx vitest run && npx playwright test && npm run build`
Expected: 全部退出码为 0

- [ ] **Step 2: 按功能块创建分支、推送、开 PR**

Run: `git checkout -b codex/pr-1-quiz-flow`
Expected: 当前分支切换成功

- [ ] **Step 3: 请求 Copilot review**

Run: `gh pr comment "$(gh pr view --json number --jq '.number')" --body "@copilot review"`
Expected: 评论成功发布

- [ ] **Step 4: 处理 review 反馈后再次验证**

Run: `npm run lint && npx vitest run && npx playwright test && npm run build`
Expected: 全部通过

- [ ] **Step 5: 合并 PR**

Run: `gh pr merge "$(gh pr view --json number --jq '.number')" --squash --delete-branch`
Expected: PR 合并成功

- [ ] **Step 6: 安装并登录 Vercel CLI**

Run: `npm install -D vercel`
Expected: 安装完成

- [ ] **Step 7: 部署**

Run: `npx vercel --prod`
Expected: 输出线上 URL

- [ ] **Step 8: 产出交付信息**

Run: `gh pr list --state merged --limit 10`
Expected: 能看到本任务生成的合并记录
