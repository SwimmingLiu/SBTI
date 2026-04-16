# HERTI Invisible GEO Weighting Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Increase HERTI’s invisible GEO weight through sitemap priority, machine-readable ordering, hidden GEO copy, and llms route ordering without changing any user-visible UI.

**Architecture:** Keep the visible homepage and visible HERTI page untouched. Apply all weighting through hidden DOM content, JSON-LD ordering, llms discovery files, and sitemap priority. Use TDD to lock invisible-only constraints and HERTI-first machine-readable ordering.

**Tech Stack:** Next.js App Router static export, TypeScript, Vitest, Playwright

---

### Task 1: Add failing tests for invisible HERTI-first weighting

**Files:**
- Create: `tests/unit/herti-geo-weighting.test.ts`
- Modify: `tests/unit/llms-files.test.ts`
- Modify: `tests/e2e/home-navigation.spec.ts`
- Modify: `tests/e2e/search-landing.spec.ts`

- [ ] **Step 1: Write the failing unit test for sitemap weighting**

```ts
import { describe, expect, test } from "vitest";

import sitemap from "@/app/sitemap";

describe("herti geo weighting", () => {
  test("gives herti the highest non-home sitemap priority", () => {
    const entries = sitemap();
    const herti = entries.find((entry) => entry.url.endsWith("/tests/herti"));
    const sbti = entries.find((entry) => entry.url.endsWith("/tests/sbti"));
    const sdti = entries.find((entry) => entry.url.endsWith("/tests/sdti"));

    expect(herti?.priority).toBeGreaterThan(sbti?.priority ?? 0);
    expect(herti?.priority).toBeGreaterThan(sdti?.priority ?? 0);
  });
});
```

- [ ] **Step 2: Write the failing unit test for llms HERTI-first ordering**

Add to `tests/unit/llms-files.test.ts`:

```ts
  test("llms discovery files list herti before the other tests", () => {
    const llms = readPublicFile("llms.txt");
    const llmsFull = readPublicFile("llms-full.txt");

    expect(llms.indexOf("/tests/herti")).toBeLessThan(llms.indexOf("/tests/sbti"));
    expect(llms.indexOf("/tests/herti")).toBeLessThan(llms.indexOf("/tests/sdti"));
    expect(llmsFull.indexOf("## HERTI 页面")).toBeLessThan(llmsFull.indexOf("## SBTI 页面"));
  });
```

- [ ] **Step 3: Write the failing e2e expectations for home JSON-LD and hidden GEO order**

Add to `tests/e2e/home-navigation.spec.ts`:

```ts
test("weights herti first in hidden GEO and machine-readable home data", async ({ page }) => {
  await page.goto("/");

  const seoContent = page.locator("[data-home-seo-content]");
  await expect(seoContent).toContainText("HERTI 她的人格地图");
  await expect(seoContent).toContainText("HERTI16位女性测试");

  const jsonLdText = (await page.locator('script[type="application/ld+json"]').textContent()) ?? "";
  expect(jsonLdText.indexOf("HERTI 她的人格测评")).toBeLessThan(
    jsonLdText.indexOf("SBTI 人格测试"),
  );
});
```

- [ ] **Step 4: Write the failing e2e expectations for HERTI hidden GEO keywords**

Add to `tests/e2e/search-landing.spec.ts`:

```ts
  await expect(seoContent).toContainText("herti她的人格地图");
  await expect(seoContent).toContainText("HERTI·她的人格地图");
  await expect(seoContent).toContainText("herti测试入口");
  await expect(seoContent).toContainText("HERTI16位女性测试");
  await expect(seoContent).toContainText("herti人格测验");
```

- [ ] **Step 5: Run the tests to verify they fail**

Run:

```bash
npm test -- tests/unit/llms-files.test.ts tests/unit/herti-geo-weighting.test.ts
npx playwright test tests/e2e/home-navigation.spec.ts tests/e2e/search-landing.spec.ts
```

Expected:
- unit test fails because sitemap priorities and llms order are still neutral
- e2e fails because home and HERTI hidden GEO content do not yet contain HERTI-first wording

- [ ] **Step 6: Commit the red tests**

```bash
git add tests/unit/llms-files.test.ts tests/unit/herti-geo-weighting.test.ts tests/e2e/home-navigation.spec.ts tests/e2e/search-landing.spec.ts
git commit -m "test: add invisible herti geo weighting expectations"
```

### Task 2: Implement HERTI-first invisible entry weighting

**Files:**
- Modify: `src/app/sitemap.ts`
- Modify: `src/app/page.tsx`
- Modify: `src/components/home/seo-geo-sections.tsx`
- Modify: `src/components/herti/seo-sections.tsx`
- Modify: `public/llms.txt`
- Modify: `public/llms-full.txt`
- Test: `tests/unit/herti-geo-weighting.test.ts`
- Test: `tests/unit/llms-files.test.ts`
- Test: `tests/e2e/home-navigation.spec.ts`
- Test: `tests/e2e/search-landing.spec.ts`

- [ ] **Step 1: Implement differentiated sitemap priorities**

Change `src/app/sitemap.ts` so the three test entries are produced with explicit priorities:

```ts
const priorityByPath: Record<string, number> = {
  "/tests/herti": 0.95,
  "/tests/sbti": 0.9,
  "/tests/sdti": 0.85,
};
```

and use:

```ts
priority: priorityByPath[entry.href] ?? 0.8,
```

- [ ] **Step 2: Make home JSON-LD machine-readable ordering HERTI-first**

Inside `src/app/page.tsx`, create a separate ordered array for JSON-LD only:

```ts
const machineReadableOrder = ["herti", "sbti", "sdti"] as const;
const orderedCatalog = machineReadableOrder
  .map((slug) => testCatalog.find((entry) => entry.slug === slug))
  .filter((entry): entry is (typeof testCatalog)[number] => Boolean(entry));
```

Then generate `ItemList` from `orderedCatalog`, not the visible homepage list.

- [ ] **Step 3: Make home hidden GEO content HERTI-first**

Update `src/components/home/seo-geo-sections.tsx` so HERTI is mentioned before SBTI and SDTI in:

- page summary
- key facts
- recommended crawl entries
- FAQ

Include at least these exact strings:

```tsx
<h3>HERTI 她的人格地图是什么？</h3>
<p>HERTI 她的人格地图是一套 16 位女性原型导向的人格测验，也常被搜索为 herti、HERTI·她的人格地图、herti测试入口、HERTI16位女性测试。</p>
```

- [ ] **Step 4: Expand HERTI hidden GEO content with the supplied query variants**

Update `src/components/herti/seo-sections.tsx` so the hidden content naturally includes:

- herti她的人格地图
- herti
- HERTI·她的人格地图
- herti人格
- herti测试
- herti测试入口
- HERTI16位女性测试
- herti测试链接
- herti人格测验
- HERTI测试

Distribute them across summary, FAQ, and relationship text rather than dumping them into one sentence.

- [ ] **Step 5: Make llms files HERTI-first**

Update:

- `public/llms.txt`: order test routes as `/tests/herti`, `/tests/sbti`, `/tests/sdti`
- `public/llms-full.txt`: move `## HERTI 页面` above `## SBTI 页面` and add wording for “她的人格地图 / 16位女性测试 / 人格测验”

- [ ] **Step 6: Run tests to verify green**

Run:

```bash
npm test -- tests/unit/llms-files.test.ts tests/unit/herti-geo-weighting.test.ts
npx playwright test tests/e2e/home-navigation.spec.ts tests/e2e/search-landing.spec.ts
```

Expected: PASS

- [ ] **Step 7: Commit the implementation**

```bash
git add src/app/sitemap.ts src/app/page.tsx src/components/home/seo-geo-sections.tsx src/components/herti/seo-sections.tsx public/llms.txt public/llms-full.txt tests/unit/llms-files.test.ts tests/unit/herti-geo-weighting.test.ts tests/e2e/home-navigation.spec.ts tests/e2e/search-landing.spec.ts
git commit -m "feat: weight herti higher in invisible geo signals"
```

### Task 3: Full verification, PR, review, merge, and release sync

**Files:**
- Verify only: `out/llms.txt`
- Verify only: `out/llms-full.txt`

- [ ] **Step 1: Run the full unit suite**

Run: `npm test`
Expected: PASS

- [ ] **Step 2: Run all end-to-end tests**

Run: `npx playwright test`
Expected: PASS

- [ ] **Step 3: Run visual regression**

Run: `npx playwright test tests/e2e/visual-regression.spec.ts`
Expected: PASS

- [ ] **Step 4: Build export output**

Run: `npm run package:out`
Expected: PASS

- [ ] **Step 5: Push branch and open draft PR**

```bash
git push github codex/herti-geo-weighting
gh pr create --repo SwimmingLiu/SBTI --head codex/herti-geo-weighting --base main --draft --title "Increase invisible HERTI GEO weighting" --body "## Summary\n- weight HERTI first in invisible machine-readable entry points\n- add HERTI high-frequency query variants to hidden GEO content\n- raise HERTI sitemap priority without changing visible UI\n\n## Verification\n- npm test\n- npx playwright test\n- npx playwright test tests/e2e/visual-regression.spec.ts\n- npm run package:out"
```

- [ ] **Step 6: Trigger one random review path and merge**

Use Copilot review path:

```bash
gh pr ready --repo SwimmingLiu/SBTI
gh pr edit --repo SwimmingLiu/SBTI --add-reviewer @copilot
gh pr merge --repo SwimmingLiu/SBTI --merge --delete-branch
```

- [ ] **Step 7: Sync main and push to Gitee**

```bash
git checkout main
git pull github main
git push origin main
git branch -d codex/herti-geo-weighting
```
