# Home Mobile And Share Card Polish Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Tighten the mobile home page so any quiz is reachable from the first screen, remove the stray `@Egeria` marker, and make all three share cards stable in long-text scenarios without letting QR copy overflow.

**Architecture:** Keep the existing desktop shell intact, add a mobile-only segmented entry pattern for the home page, centralize QR watermark copy/layout in the shared component, and let each share-card template consume shorter share-safe summaries inside a bottom CTA strip.

**Tech Stack:** Next.js App Router, React 19, Tailwind CSS 4, Vitest, Playwright

---

### Task 1: Rework the home page for mobile-first entry switching

**Files:**
- Modify: `src/components/home/test-home.tsx`
- Modify: `src/components/home/test-entry-card.tsx`
- Modify: `src/lib/test-catalog.ts`
- Modify: `.gitignore`
- Test: `tests/e2e/home-navigation.spec.ts`

- [ ] **Step 1: Write the failing mobile-home assertions**

Implementation target:

```ts
test("shows mobile quiz tabs without the mini-program panel", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/?disableMiniProgramRedirect=1");

  await expect(page.getByRole("button", { name: "SBTI" })).toBeVisible();
  await expect(page.getByRole("button", { name: "SDTI" })).toBeVisible();
  await expect(page.getByRole("button", { name: "HERTI" })).toBeVisible();
  await expect(page.getByText("微信小程序入口")).toHaveCount(0);
});
```

Expected: FAIL because the current mobile home still renders the old stacked layout.

- [ ] **Step 2: Run the targeted test and verify the failure**

Run:

```bash
npx playwright test tests/e2e/home-navigation.spec.ts --grep "mobile quiz tabs"
```

Expected: FAIL with missing tab buttons and/or the mini-program panel still visible.

- [ ] **Step 3: Add compact mobile entry metadata and remove redundant mobile tags**

Implementation target:

```ts
export type TestCatalogEntry = {
  accent: string;
  mobileDescription: string;
  mobileTagline: string;
  description: string;
  href: string;
  name: string;
  questionCount: number;
  resultCount: number;
  slug: TestSlug;
  status: "live" | "planned";
  tagline: string;
  tags: string[];
};

{
  accent: "from-[#6c8d71] to-[#4d6a53]",
  description: "已完成复刻的原始题库，保留 31 题、15 维度、结果图与隐藏机制。",
  href: "/tests/sbti",
  name: "SBTI 人格测试",
  questionCount: 31,
  resultCount: 27,
  slug: "sbti",
  status: "live",
  tagline: "绿色系 · 图片结果 · 已上线",
  tags: ["现有题库", "结果分享", "隐藏人格"],
  mobileDescription: "31 题，15 维度，保留结果图与隐藏机制。",
  mobileTagline: "绿色系 · 图片结果 · 已上线",
}
```

Expected: each card has short mobile-safe copy without the redundant `现有题库 / 结果分享` style tags.

- [ ] **Step 4: Build a mobile-only segmented switcher with a single active card**

Implementation target:

```tsx
const [activeSlug, setActiveSlug] = useState<TestSlug>("sbti");
const activeEntry = testCatalog.find((entry) => entry.slug === activeSlug) ?? testCatalog[0];

<div className="grid grid-cols-3 gap-2 md:hidden">
  {testCatalog.map((entry) => (
    <button
      className={entry.slug === activeSlug ? "bg-[var(--accent-strong)] text-white" : "bg-white text-[var(--muted)]"}
      key={entry.slug}
      onClick={() => setActiveSlug(entry.slug)}
      type="button"
    >
      {entry.slug.toUpperCase()}
    </button>
  ))}
</div>

<div className="md:hidden">
  <TestEntryCard compact entry={activeEntry} />
</div>
<div className="mt-10 hidden gap-5 lg:grid lg:grid-cols-3">
  {testCatalog.map((entry) => (
    <TestEntryCard entry={entry} key={entry.slug} />
  ))}
</div>
```

Expected: mobile shows three switches plus one active compact card; desktop keeps the multi-card layout.

- [ ] **Step 5: Keep the mini-program panel desktop-only and ignore brainstorm artifacts**

Implementation target:

```tsx
{!clientEnv.isInMiniProgram ? (
  <div className="mt-8 hidden rounded-[24px] border border-[var(--line)] bg-[linear-gradient(180deg,#fbfefb,#f4faf5)] p-5 md:block md:p-6">
    <div className="flex flex-col justify-center">
      <div className="inline-flex w-fit rounded-full bg-[var(--soft)] px-3 py-1.5 text-xs font-semibold tracking-[0.14em] text-[var(--accent-strong)]">
        微信小程序入口
      </div>
    </div>
  </div>
) : null}
```

```gitignore
.superpowers/
```

Expected: mobile no longer shows the mini-program box, and local brainstorm/mockup files stay untracked.

- [ ] **Step 6: Make the compact card variant keep key copy on single lines where intended**

Implementation target:

```tsx
export function TestEntryCard({ compact = false, entry }: TestEntryCardProps) {
  const description = compact ? entry.mobileDescription : entry.description;
  const tagline = compact ? entry.mobileTagline : entry.tagline;

  return (
    <article
      className={
        compact
          ? "min-w-0 rounded-[20px] border border-[var(--line)] bg-white p-4 shadow-[0_14px_30px_rgba(26,42,34,0.06)]"
          : "min-w-0 rounded-[24px] border border-[var(--line)] bg-white p-6 shadow-[0_18px_40px_rgba(26,42,34,0.06)]"
      }
    >
      <h2 className={compact ? "text-[clamp(1.35rem,5vw,1.7rem)] font-semibold leading-tight tracking-[-0.03em] whitespace-nowrap text-[var(--foreground)]" : "mt-4 max-w-full whitespace-normal text-[clamp(1.5rem,1.8vw,2rem)] font-semibold leading-tight tracking-[-0.03em] text-[var(--foreground)] sm:whitespace-nowrap"}>{entry.name}</h2>
      <p className={compact ? "text-sm leading-7" : "text-sm leading-7"}>{description}</p>
      <p className={compact ? "text-xs whitespace-nowrap font-medium text-[var(--accent-strong)]" : "text-sm font-medium text-[var(--accent-strong)]"}>{tagline}</p>
    </article>
  );
}
```

Expected: the active mobile card is denser without awkward line breaks in title/tagline/status.

- [ ] **Step 7: Re-run the targeted home tests**

Run:

```bash
npx playwright test tests/e2e/home-navigation.spec.ts
```

Expected: PASS for the existing home checks plus the new mobile-tab assertion.

- [ ] **Step 8: Commit Task 1**

Run:

```bash
git add .gitignore src/components/home/test-home.tsx src/components/home/test-entry-card.tsx src/lib/test-catalog.ts tests/e2e/home-navigation.spec.ts
git commit -m "feat: tighten mobile home entry layout"
```

Expected: one commit containing only home-layout and ignore-rule changes.

### Task 2: Make share-card copy share-safe and remove the SDTI footer marker

**Files:**
- Modify: `src/components/shared/share-qr-watermark.tsx`
- Modify: `src/lib/result-share.ts`
- Modify: `src/components/sbti/result-screen.tsx`
- Modify: `src/features/sdti/sdti-app.tsx`
- Modify: `src/features/herti/herti-app.tsx`
- Test: `tests/unit/result-share.test.ts`
- Test: `tests/e2e/sdti-flow.spec.ts`

- [ ] **Step 1: Write the failing share-helper and SDTI marker tests**

Implementation target:

```ts
it("shortens overly long share summaries before building share text", () => {
  const meta = buildResultShareMeta({
    code: "SDTI",
    label: "阅人无数型",
    quizName: "SDTI 人格测评",
    slug: "sdti",
    summary: "这是一段明显超过分享图安全长度的超长描述，用来验证摘要截断行为和省略号结尾。",
  });

  expect(meta.summary).toMatch(/…$/);
  expect(meta.summary.length).toBeLessThanOrEqual(48);
});
```

```ts
test("does not render the @Egeria footer on sdti pages", async ({ page }) => {
  await page.goto("/tests/sdti");
  await expect(page.getByText("@Egeria")).toHaveCount(0);
});
```

Expected: FAIL because there is no summary-clamping helper yet and the page still shows `@Egeria`.

- [ ] **Step 2: Run the focused RED phase**

Run:

```bash
npm test -- result-share
npx playwright test tests/e2e/sdti-flow.spec.ts --grep "@Egeria"
```

Expected: FAIL for both new assertions.

- [ ] **Step 3: Extend the share helper with share-safe summary output**

Implementation target:

```ts
export type ResultShareMeta = {
  fileName: string;
  summary: string;
  text: string;
  title: string;
};

export function toShareCardSummary(summary: string, maxLength = 48) {
  const normalized = summary.replace(/\s+/g, " ").trim();
  return normalized.length <= maxLength ? normalized : `${normalized.slice(0, maxLength - 1).trimEnd()}…`;
}

export function buildResultShareMeta(input: ResultShareMetaInput): ResultShareMeta {
  const safeSummary = toShareCardSummary(input.summary);

  return {
    fileName: `${input.slug}-${input.code}.png`,
    summary: safeSummary,
    text: `我测出来的${input.quizName}结果是 ${input.label}，${safeSummary}。快来看看你的结果。`,
    title: `我的${input.quizName}结果：${input.label}`,
  };
}
```

Expected: every quiz can render a shorter share-safe excerpt without changing the full result-page copy.

- [ ] **Step 4: Convert the watermark component to the final single-line CTA copy**

Implementation target:

```tsx
export function ShareQrWatermark({ className, src = shareQrCodeUrl }: ShareQrWatermarkProps) {
  return (
    <div className={`pointer-events-none flex items-center gap-3 ${className ?? ""}`}>
      <div className="h-11 w-11 overflow-hidden rounded-xl bg-transparent">
        <img
          alt="小橙有门二维码"
          className="h-full w-full object-cover"
          decoding="sync"
          height={44}
          loading="eager"
          src={src}
          width={44}
        />
      </div>
      <div className="whitespace-nowrap text-[12px] font-semibold text-[#2f3d34]">
        小橙有门 · 扫码开始测试
      </div>
    </div>
  );
}
```

Expected: the shared QR CTA has one stable copy string and cannot wrap internally.

- [ ] **Step 5: Move each share-card QR CTA into a bottom strip and consume the safe summary**

Implementation target:

```tsx
const shareTitle = result.name;

<div
  style={{
    background: "#f7f7f7",
    border: "1px solid #e7e7e7",
    borderRadius: "18px",
    marginTop: "18px",
    padding: "20px",
  }}
>
  <div style={{ color: "#111", fontSize: "42px", fontWeight: 700, lineHeight: 1.2 }}>{shareTitle}</div>
  <div style={{ color: "#555", fontSize: "24px", lineHeight: 1.8, marginTop: "16px" }}>
    {shareMeta.summary}
  </div>
  <div style={{ borderTop: "1px solid #ddd", marginTop: "18px", paddingTop: "16px" }}>
    <ShareQrWatermark />
  </div>
</div>
```

Apply the same pattern to:

```tsx
src/components/sbti/result-screen.tsx
src/features/sdti/sdti-app.tsx
src/features/herti/herti-app.tsx
```

Expected: title and summary remain full-width, QR CTA no longer compresses the body, and all three cards share the same footer-strip rule.

- [ ] **Step 6: Remove the SDTI footer marker**

Implementation target:

```tsx
<footer className="mt-10 text-center">
  <button
    className="bg-[#222] px-10 py-3 text-sm font-medium tracking-[0.12em] text-white transition hover:bg-black"
    id="submit-btn"
    onClick={handleSubmit}
    type="button"
  >
    提 交
  </button>
  <div className="mt-4 text-xs text-[#999]">※ 结果仅供娱乐 ※</div>
</footer>
```

Expected: `@Egeria` disappears from the page entirely.

- [ ] **Step 7: Verify the GREEN phase**

Run:

```bash
npm test -- result-share
npx playwright test tests/e2e/sdti-flow.spec.ts
```

Expected: PASS for the updated unit tests and the SDTI flow checks.

- [ ] **Step 8: Commit Task 2**

Run:

```bash
git add src/components/shared/share-qr-watermark.tsx src/lib/result-share.ts src/components/sbti/result-screen.tsx src/features/sdti/sdti-app.tsx src/features/herti/herti-app.tsx tests/unit/result-share.test.ts tests/e2e/sdti-flow.spec.ts
git commit -m "feat: stabilize share card layouts"
```

Expected: one commit containing the QR CTA and share-summary logic changes.

### Task 3: Refresh visual baselines and verify the branch end-to-end

**Files:**
- Modify: `tests/e2e/visual-regression.spec.ts`
- Update: `tests/e2e/visual-regression.spec.ts-snapshots/home-library-compact-chromium-darwin.png`
- Update: `tests/e2e/visual-regression.spec.ts-snapshots/sbti-share-dialog-chromium-darwin.png`
- Update: `tests/e2e/visual-regression.spec.ts-snapshots/sdti-share-dialog-chromium-darwin.png`
- Update: `tests/e2e/visual-regression.spec.ts-snapshots/sdti-feminist-share-dialog-chromium-darwin.png`
- Update: `tests/e2e/visual-regression.spec.ts-snapshots/herti-share-dialog-chromium-darwin.png`

- [ ] **Step 1: Add a dedicated mobile-home visual expectation if needed**

Implementation target:

```ts
test("home page compact mobile switcher visual baseline", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/?disableMiniProgramRedirect=1");
  await disableMotion(page);

  await expectLocatorSnapshot(page.locator("main > section").first(), "home-library-compact-mobile.png");
});
```

Expected: a stable visual check exists for the real mobile width that motivated the redesign.

- [ ] **Step 2: Refresh the affected snapshots**

Run:

```bash
npx playwright test tests/e2e/visual-regression.spec.ts --update-snapshots
```

Expected: the compact home and share-dialog baselines regenerate successfully.

- [ ] **Step 3: Verify visual coverage without updating snapshots**

Run:

```bash
npx playwright test tests/e2e/visual-regression.spec.ts
```

Expected: PASS with zero visual diffs.

- [ ] **Step 4: Run the required repo-wide verification**

Run:

```bash
npm test
npx playwright test
npx playwright test tests/e2e/visual-regression.spec.ts
```

Expected: all required checks pass cleanly.

- [ ] **Step 5: Commit Task 3**

Run:

```bash
git add tests/e2e/visual-regression.spec.ts tests/e2e/visual-regression.spec.ts-snapshots
git commit -m "test: refresh mobile and share visual baselines"
```

Expected: one commit containing only visual-test changes.

### Task 4: Publish, review, merge, and package the finished work

**Files:**
- Verify whole branch state

- [ ] **Step 1: Push the feature branch**

Run:

```bash
git push github codex/home-mobile-share-card-polish
```

Expected: branch is available on GitHub.

- [ ] **Step 2: Create a draft PR**

Run:

```bash
gh pr create --draft --title "Polish home mobile layout and share cards" --body "## Summary
- tighten the mobile home entry experience
- stabilize share-card layouts and remove @Egeria
- refresh visual coverage
"
```

Expected: a draft PR URL is returned.

- [ ] **Step 3: Trigger one code review pass**

Run:

```bash
gh pr view --web
```

Expected: open the PR in the browser, request either Copilot Review or Claude Review once, and collect any actionable feedback.

- [ ] **Step 4: If review changes are needed, re-run the required verification loop**

Run:

```bash
npm test
npx playwright test
npx playwright test tests/e2e/visual-regression.spec.ts
```

Expected: any review-driven edits are re-verified before merge.

- [ ] **Step 5: Merge the PR**

Run:

```bash
gh pr merge --squash --delete-branch
```

Expected: the GitHub PR merges successfully.

- [ ] **Step 6: Package the static output**

Run:

```bash
npm run package:out
```

Expected: the deployable archive is regenerated under `dist/` and `out/`.

- [ ] **Step 7: Push the merged result to Gitee**

Run:

```bash
git checkout main
git pull --ff-only
git push origin main
```

Expected: the final merged code is synchronized to the Gitee remote.
