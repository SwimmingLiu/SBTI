# Hidden GEO llms.txt and Structured Data Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `llms.txt` and `llms-full.txt`, strengthen hidden GEO content, and align page-level JSON-LD with the hidden GEO narrative without adding any user-visible UI.

**Architecture:** Keep the existing page structure and `.seo-content-hidden` approach. Add static discovery files under `public/`, tighten the hidden GEO copy on home and test pages, and update JSON-LD content in page entry files so discovery files, hidden DOM content, and structured data all describe the same page semantics.

**Tech Stack:** Next.js App Router static export, TypeScript, Playwright, Vitest

---

### Task 1: Add failing GEO discovery and hidden-content assertions

**Files:**
- Modify: `tests/e2e/home-navigation.spec.ts`
- Modify: `tests/e2e/search-landing.spec.ts`
- Create: `tests/unit/llms-files.test.ts`

- [ ] **Step 1: Write the failing unit test for llms discovery files**

```ts
import fs from "node:fs";
import path from "node:path";
import { describe, expect, test } from "vitest";

const projectRoot = path.resolve(__dirname, "../..");

function readPublicFile(fileName: string) {
  return fs.readFileSync(path.join(projectRoot, "public", fileName), "utf8");
}

describe("llms discovery files", () => {
  test("llms.txt and llms-full.txt describe the real routes", () => {
    const llms = readPublicFile("llms.txt");
    const llmsFull = readPublicFile("llms-full.txt");

    expect(llms).toContain("/tests/sbti");
    expect(llms).toContain("/tests/sdti");
    expect(llms).toContain("/tests/herti");
    expect(llmsFull).toContain("SBTI 和 SBTi");
    expect(llmsFull).toContain("首页");
    expect(llmsFull).toContain("FAQ");
    expect(llmsFull).not.toContain("FWTI");
  });
});
```

- [ ] **Step 2: Run the unit test to verify it fails**

Run: `npm test -- tests/unit/llms-files.test.ts`
Expected: FAIL because `public/llms.txt` and `public/llms-full.txt` do not exist yet

- [ ] **Step 3: Tighten the hidden GEO expectations in end-to-end tests**

Add assertions like:

```ts
await expect(seoContent).toContainText("页面摘要");
await expect(seoContent).toContainText("关键事实");
await expect(seoContent).toContainText("与题库首页的关系");
```

and for the home page:

```ts
await expect(seoContent).toContainText("页面摘要");
await expect(seoContent).toContainText("题库与测试页关系");
await expect(seoContent).toContainText("推荐抓取入口");
```

- [ ] **Step 4: Run the focused Playwright tests to verify they fail**

Run: `npx playwright test tests/e2e/home-navigation.spec.ts tests/e2e/search-landing.spec.ts`
Expected: FAIL because the current hidden GEO blocks do not yet contain the new structure text

- [ ] **Step 5: Commit the red tests**

```bash
git add tests/unit/llms-files.test.ts tests/e2e/home-navigation.spec.ts tests/e2e/search-landing.spec.ts
git commit -m "test: add hidden geo discovery expectations"
```

### Task 2: Implement llms discovery files and hidden GEO copy

**Files:**
- Create: `public/llms.txt`
- Create: `public/llms-full.txt`
- Modify: `src/components/home/seo-geo-sections.tsx`
- Modify: `src/components/sbti/seo-sections.tsx`
- Modify: `src/components/sdti/seo-sections.tsx`
- Modify: `src/components/herti/seo-sections.tsx`
- Test: `tests/unit/llms-files.test.ts`
- Test: `tests/e2e/home-navigation.spec.ts`
- Test: `tests/e2e/search-landing.spec.ts`

- [ ] **Step 1: Add `public/llms.txt`**

Include:

```text
# 人格测试题库

一个聚合 SBTI 人格测试、SDTI 人格测评、HERTI 她的人格测评的中文人格测试站点。

## 首选入口
- / : 首页 / 题库聚合页
- /tests/sbti : SBTI 人格测试
- /tests/sdti : SDTI 人格测评
- /tests/herti : HERTI 她的人格测评

## 抓取建议
- 优先读取各页面的 H1、隐藏页面摘要、关键事实和 FAQ
- 首页用于题库导航与 SBTI / SBTi 消歧
- 具体答案优先以各测试页为准

## 更多信息
- /llms-full.txt
```

- [ ] **Step 2: Add `public/llms-full.txt`**

Include:

```text
# 人格测试题库 - LLM Full Map

## 站点定位
该站点是一个中文人格测试题库，当前提供 SBTI 人格测试、SDTI 人格测评、HERTI 她的人格测评三套测试入口与结果说明。

## 首页
- URL: /
- 作用：题库聚合、测试导航、SBTI / SBTi 消歧
- 关键提取项：页面摘要、已上线测试、题库与测试页关系、FAQ

## SBTI 页面
- URL: /tests/sbti
- 作用：承接 sbti测试 / sbti人格测试 / sbti测评入口
- 关键提取项：页面摘要、关键事实、结果说明、FAQ、与 SBTi 的消歧

## SDTI 页面
- URL: /tests/sdti
- 作用：承接 sdti人格测评
- 关键提取项：页面摘要、关键事实、结果页结构、FAQ

## HERTI 页面
- URL: /tests/herti
- 作用：承接 herti她的人格测评 / herti人格地图
- 关键提取项：页面摘要、关键事实、原型结果结构、FAQ

## 提取顺序
1. H1
2. 隐藏页面摘要
3. 关键事实
4. FAQ
5. metadata 与 JSON-LD

## 消歧说明
SBTI 页面中的 SBTI 指人格测试，不是 Science Based Targets initiative（SBTi）。
```

- [ ] **Step 3: Upgrade the hidden GEO blocks**

Refactor each hidden section so the text includes explicit headings for:

- 页面摘要
- 关键事实
- FAQ
- 页面关系 or 题库关系

Keep the sections visually hidden by continuing to use `className="seo-content-hidden"` and the existing `data-*` hooks.

- [ ] **Step 4: Run the targeted tests to verify green**

Run:
- `npm test -- tests/unit/llms-files.test.ts`
- `npx playwright test tests/e2e/home-navigation.spec.ts tests/e2e/search-landing.spec.ts`

Expected: PASS

- [ ] **Step 5: Commit the implementation**

```bash
git add public/llms.txt public/llms-full.txt src/components/home/seo-geo-sections.tsx src/components/sbti/seo-sections.tsx src/components/sdti/seo-sections.tsx src/components/herti/seo-sections.tsx tests/unit/llms-files.test.ts tests/e2e/home-navigation.spec.ts tests/e2e/search-landing.spec.ts
git commit -m "feat: add hidden geo discovery files and stronger hidden copy"
```

### Task 3: Align page-level JSON-LD with the hidden GEO narrative

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/app/tests/sbti/page.tsx`
- Modify: `src/app/tests/sdti/page.tsx`
- Modify: `src/app/tests/herti/page.tsx`
- Test: `tests/e2e/search-landing.spec.ts`

- [ ] **Step 1: Extend the end-to-end assertions to cover JSON-LD language**

Add focused assertions for the serialized JSON-LD script content, such as:

```ts
await expect(page.locator('script[type="application/ld+json"]').first()).toContainText("页面摘要");
```

or, if checking the whole script is too broad, assert the page source contains updated phrases:

```ts
await expect(page.locator("body")).toContainText("SBTI 测试流程");
```

Prefer exact strings that come from the updated JSON-LD descriptions and FAQ copy.

- [ ] **Step 2: Run the focused Playwright suite to verify it fails**

Run: `npx playwright test tests/e2e/search-landing.spec.ts`
Expected: FAIL because the current JSON-LD descriptions still use the old wording

- [ ] **Step 3: Update JSON-LD copy on home and test pages**

Keep the existing schema types, but rewrite descriptions and FAQ text so they match the new hidden GEO wording:

- home page: emphasize题库聚合、测试页关系、SBTI / SBTi 消歧
- sbti page: emphasize页面摘要、关键事实、结果机制
- sdti page: emphasize维度结构、隐藏结局、结果说明
- herti page: emphasize原型结构、镜像人格、反面人格

- [ ] **Step 4: Re-run the focused Playwright test to verify green**

Run: `npx playwright test tests/e2e/search-landing.spec.ts`
Expected: PASS

- [ ] **Step 5: Commit the schema alignment**

```bash
git add src/app/page.tsx src/app/tests/sbti/page.tsx src/app/tests/sdti/page.tsx src/app/tests/herti/page.tsx tests/e2e/search-landing.spec.ts
git commit -m "refactor: align geo schema with hidden geo copy"
```

### Task 4: Full verification and export proof

**Files:**
- Verify only: `public/llms.txt`
- Verify only: `public/llms-full.txt`
- Verify only: `out/llms.txt`
- Verify only: `out/llms-full.txt`

- [ ] **Step 1: Run unit tests**

Run: `npm test`
Expected: PASS

- [ ] **Step 2: Run all end-to-end tests**

Run: `npx playwright test`
Expected: PASS

- [ ] **Step 3: Run visual regression tests**

Run: `npx playwright test tests/e2e/visual-regression.spec.ts`
Expected: PASS

- [ ] **Step 4: Build export output**

Run: `npm run package:out`
Expected: PASS and create `out/` plus `dist/sbti-static-out.zip`

- [ ] **Step 5: Verify exported discovery files exist**

Run:

```bash
test -f out/llms.txt
test -f out/llms-full.txt
```

Expected: zero exit status

- [ ] **Step 6: Commit final GEO updates**

```bash
git add .
git commit -m "chore: finalize hidden geo optimization"
```
