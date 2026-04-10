# Share Watermark And Result Actions Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move the share-image QR watermark upward across SBTI, SDTI, and HERTI share cards, and redesign the SBTI result action area so desktop and mobile both feel integrated with the result content.

**Architecture:** Keep one reusable QR watermark component, update each share-card template to reserve space where needed, and move the SBTI action buttons into a dedicated action card inside the right-side content column. Validate changes primarily through existing Playwright visual baselines.

**Tech Stack:** Next.js App Router, React 19, Tailwind CSS 4, Vitest, Playwright

---

### Task 1: Reposition QR watermarks in all share-card templates

**Files:**
- Modify: `src/components/shared/share-qr-watermark.tsx`
- Modify: `src/components/sbti/result-screen.tsx`
- Modify: `src/features/sdti/sdti-app.tsx`
- Modify: `src/features/herti/herti-app.tsx`
- Update: `tests/e2e/visual-regression.spec.ts-snapshots/sbti-share-dialog-chromium-darwin.png`
- Update: `tests/e2e/visual-regression.spec.ts-snapshots/sdti-share-dialog-chromium-darwin.png`
- Update: `tests/e2e/visual-regression.spec.ts-snapshots/herti-share-dialog-chromium-darwin.png`

- [ ] **Step 1: Inspect each share-card template and identify where the watermark should anchor**

Run:

```bash
sed -n '1,220p' src/components/shared/share-qr-watermark.tsx
sed -n '280,430p' src/components/sbti/result-screen.tsx
sed -n '340,430p' src/features/sdti/sdti-app.tsx
sed -n '520,610p' src/features/herti/herti-app.tsx
```

Expected: confirm that all three templates currently place `ShareQrWatermark` in the bottom-right corner.

- [ ] **Step 2: Make the watermark component more compact without changing its content**

Implementation target:

```tsx
type ShareQrWatermarkProps = {
  className?: string;
};

export function ShareQrWatermark({ className }: ShareQrWatermarkProps) {
  return (
    <div className={`pointer-events-none flex items-center gap-2.5 rounded-2xl ... ${className ?? ""}`}>
      <div className="relative h-10 w-10 ...">
        ...
      </div>
      <div className="text-left">
        <div className="text-[11px] font-semibold ...">小橙有门</div>
        <div className="mt-0.5 text-[10px] leading-4 ...">扫码查看入口</div>
      </div>
    </div>
  );
}
```

Expected: watermark footprint shrinks enough to fit upper-right whitespace.

- [ ] **Step 3: Move the SBTI watermark into the summary card’s upper-right safe area**

Implementation target:

```tsx
<div
  style={{
    ...,
    padding: "20px 180px 20px 20px",
    position: "relative",
  }}
>
  ...
  <ShareQrWatermark className="absolute right-5 top-5" />
</div>
```

Expected: summary copy reserves right-side space and the watermark no longer sits at the bottom edge.

- [ ] **Step 4: Move the SDTI watermark into the result description card’s upper-right safe area**

Implementation target:

```tsx
<div
  style={{
    ...,
    padding: "20px 176px 20px 20px",
    position: "relative",
  }}
>
  ...
  <ShareQrWatermark className="absolute right-5 top-5" />
</div>
```

Expected: watermark sits near the upper-right corner of the gray description block instead of the lower-right corner.

- [ ] **Step 5: Move the HERTI watermark into the overall card’s upper-right whitespace**

Implementation target:

```tsx
<div className="relative overflow-hidden rounded-[24px] ...">
  ...
  <ShareQrWatermark className="absolute right-6 top-6" />
</div>
```

Expected: watermark appears in the title-area whitespace and does not overlap the epigraph body.

- [ ] **Step 6: Refresh the affected visual baselines**

Run:

```bash
npx playwright test tests/e2e/visual-regression.spec.ts --update-snapshots --grep 'share dialog'
```

Expected: the three share-dialog snapshots regenerate successfully.

- [ ] **Step 7: Verify targeted visual coverage**

Run:

```bash
npx playwright test tests/e2e/visual-regression.spec.ts --grep 'share dialog'
```

Expected: 3 passing tests, 0 failures.

- [ ] **Step 8: Commit Task 1**

Run:

```bash
git add src/components/shared/share-qr-watermark.tsx src/components/sbti/result-screen.tsx src/features/sdti/sdti-app.tsx src/features/herti/herti-app.tsx tests/e2e/visual-regression.spec.ts-snapshots/sbti-share-dialog-chromium-darwin.png tests/e2e/visual-regression.spec.ts-snapshots/sdti-share-dialog-chromium-darwin.png tests/e2e/visual-regression.spec.ts-snapshots/herti-share-dialog-chromium-darwin.png
git commit -m "feat: move share qr watermarks upward"
```

Expected: one commit containing only watermark-related code and snapshot updates.

### Task 2: Redesign the SBTI result action area and update result baselines

**Files:**
- Modify: `src/components/sbti/result-screen.tsx`
- Update: `tests/e2e/visual-regression.spec.ts-snapshots/sbti-result-screen-chromium-darwin.png`
- Reuse: `tests/e2e/result-screen.spec.ts`

- [ ] **Step 1: Inspect the current SBTI result layout and locate the detached action row**

Run:

```bash
sed -n '130,280p' src/components/sbti/result-screen.tsx
```

Expected: confirm the action row currently sits below the main result card container.

- [ ] **Step 2: Add an action card inside the right-hand content column**

Implementation target:

```tsx
<div className="flex flex-col gap-4">
  ...
  <div className="rounded-[24px] border border-[var(--line)] bg-[linear-gradient(180deg,#ffffff,#fbfdfb)] p-5">
    <div className="text-sm font-medium text-[var(--foreground)]">下一步操作</div>
    <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
      <button ...>分享结果</button>
      <button ...>重新测试</button>
      <button ...>回到首页</button>
    </div>
  </div>
</div>
```

Expected: the buttons visually belong to the right-side result summary area.

- [ ] **Step 3: Remove the old detached bottom action row**

Implementation target:

```tsx
// delete the standalone
<div className="mt-6 flex flex-wrap gap-3">...</div>
```

Expected: no duplicate action buttons remain on the page.

- [ ] **Step 4: Tune responsive behavior so desktop and mobile both stay compact**

Implementation target:

```tsx
<div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
  <button className="sm:col-span-2 lg:col-span-1 ...">分享结果</button>
  ...
</div>
```

Expected: mobile stacks naturally, mid-size screens get a compact two-row layout, and desktop returns to a clean one-column action card.

- [ ] **Step 5: Refresh the SBTI result-screen visual baseline**

Run:

```bash
npx playwright test tests/e2e/visual-regression.spec.ts --update-snapshots --grep 'sbti result'
```

Expected: the `sbti-result-screen` snapshot updates successfully.

- [ ] **Step 6: Verify the SBTI result and existing interaction coverage**

Run:

```bash
npx playwright test tests/e2e/result-screen.spec.ts tests/e2e/visual-regression.spec.ts --grep 'sbti result|submits a full quiz'
```

Expected: result interaction test and SBTI visual baseline both pass.

- [ ] **Step 7: Commit Task 2**

Run:

```bash
git add src/components/sbti/result-screen.tsx tests/e2e/visual-regression.spec.ts-snapshots/sbti-result-screen-chromium-darwin.png
git commit -m "feat: redesign sbti result actions"
```

Expected: one commit containing the integrated action-card redesign and updated snapshot.

### Task 3: Run final verification on the complete branch

**Files:**
- Verify whole branch state

- [ ] **Step 1: Run unit tests**

Run:

```bash
npm test
```

Expected: all Vitest suites pass.

- [ ] **Step 2: Run the full Playwright suite**

Run:

```bash
npx playwright test
```

Expected: all Playwright tests pass, including visual baselines.

- [ ] **Step 3: Re-run the explicit visual-regression suite required by the repository**

Run:

```bash
npx playwright test tests/e2e/visual-regression.spec.ts
```

Expected: all visual regression tests pass with no snapshot diffs.

- [ ] **Step 4: Commit any carried-over approved changes that are still unstaged**

Run:

```bash
git add src/components/home/test-home.tsx tests/e2e/visual-regression.spec.ts-snapshots/home-library-shell-chromium-darwin.png tests/e2e/visual-regression.spec.ts-snapshots/home-library-compact-chromium-darwin.png docs/superpowers/specs/2026-04-10-share-watermark-and-result-actions-design.md docs/superpowers/plans/2026-04-10-share-watermark-and-result-actions.md
git commit -m "chore: align home copy and layout docs"
```

Expected: branch contains the already-approved home-copy removal plus the design/plan artifacts if they are not yet committed.
