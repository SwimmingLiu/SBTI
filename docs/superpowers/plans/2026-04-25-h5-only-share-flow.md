# H5-only Share Flow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Keep WeChat card sharing for normal WeChat H5 pages, but change mini-program web-view result dialogs to a truthful H5-only flow: share image preview plus copyable link/text guidance.

**Architecture:** Remove the current mini-program bridge path from result dialogs and treat mini-program web-view as a constrained browser surface. Add small H5 share helpers for clipboard-oriented actions, then update the three result dialogs to reuse the same environment split: WeChat H5 keeps OA JS-SDK, mini-program web-view exposes copy-link/copy-text actions and image-save guidance.

**Tech Stack:** Next.js, React, TypeScript, Vitest, Playwright

---

### Task 1: Lock down the H5-only behavior with failing tests

**Files:**
- Modify: `/Users/swimmingliu/data/github-proj/sbti/tests/e2e/mini-program-share.spec.ts`
- Modify: `/Users/swimmingliu/data/github-proj/sbti/tests/unit/mini-program.test.ts`

- [ ] Rewrite the mini-program e2e so it expects no OA signature request, no `wx.config`, no `wx.miniProgram.postMessage`, and mini-program-specific share actions in the dialog.
- [ ] Run the rewritten mini-program tests and confirm they fail against the current bridge-based behavior.
- [ ] Remove or rewrite the unit assertion that hardcodes the bridge message shape, keeping only environment/config tests that still apply.

### Task 2: Implement H5-only share helpers

**Files:**
- Modify: `/Users/swimmingliu/data/github-proj/sbti/src/lib/result-share.ts`
- Modify: `/Users/swimmingliu/data/github-proj/sbti/src/lib/mini-program.ts`

- [ ] Add a clipboard helper with `navigator.clipboard.writeText` first and a `document.execCommand("copy")` fallback.
- [ ] Remove the mini-program share-bridge builder/post helper that is no longer used by the H5-only flow.
- [ ] Keep mini-program environment detection helpers intact because the UI still needs to branch on web-view vs. normal H5.

### Task 3: Update the three result dialogs

**Files:**
- Modify: `/Users/swimmingliu/data/github-proj/sbti/src/components/sbti/result-screen.tsx`
- Modify: `/Users/swimmingliu/data/github-proj/sbti/src/features/sdti/sdti-app.tsx`
- Modify: `/Users/swimmingliu/data/github-proj/sbti/src/features/herti/herti-app.tsx`

- [ ] Stop calling the mini-program bridge helper from all three result screens.
- [ ] Keep OA JS-SDK initialization only for normal WeChat H5 pages.
- [ ] In mini-program web-view dialogs, replace the misleading “去微信菜单分享” path with explicit H5-only actions: copy share text, copy result link, and image-save guidance tied to the generated preview.
- [ ] Update dialog help text and result messages so the product no longer claims mini-program card sharing works.

### Task 4: Verify and ship

**Files:**
- Modify if needed: `/Users/swimmingliu/data/github-proj/sbti/README.md`

- [ ] Run `npm test`.
- [ ] Run `npx playwright test`.
- [ ] Run `npx playwright test tests/e2e/visual-regression.spec.ts`.
- [ ] Perform one local review on the final diff and fix anything found.
- [ ] Push branch, open PR, merge, run `npm run package:out`, and push `main` to gitee.
