"use client";

import Image from "next/image";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";

import { SeoGeoSections } from "@/components/home/seo-geo-sections";
import { TestEntryCard } from "@/components/home/test-entry-card";
import {
  getMiniProgramConfig,
  isWechatMiniProgram,
  shouldAutoRedirectToMiniProgram,
} from "@/lib/mini-program";
import { testCatalog, type TestSlug } from "@/lib/test-catalog";

const SERVER_CLIENT_ENV_SNAPSHOT = JSON.stringify({
  isInMiniProgram: false,
  isMobile: false,
  search: "",
});

export function TestHome() {
  const miniProgramConfig = useMemo(() => getMiniProgramConfig(), []);
  const [activeSlug, setActiveSlug] = useState<TestSlug>("sbti");
  const [isRedirectDismissed, setIsRedirectDismissed] = useState(false);
  const [isQrPreviewVisible, setIsQrPreviewVisible] = useState(false);
  const clientEnvSnapshot = useSyncExternalStore(
    (onStoreChange) => {
      if (typeof window === "undefined") {
        return () => undefined;
      }

      const mediaQuery = window.matchMedia("(max-width: 768px)");
      mediaQuery.addEventListener("change", onStoreChange);
      window.addEventListener("popstate", onStoreChange);

      return () => {
        mediaQuery.removeEventListener("change", onStoreChange);
        window.removeEventListener("popstate", onStoreChange);
      };
    },
    () =>
      JSON.stringify({
        isInMiniProgram: isWechatMiniProgram({
          hasMiniProgramApi: Boolean((window as { wx?: { miniProgram?: unknown } }).wx?.miniProgram),
          userAgent: window.navigator.userAgent,
          wxEnv: (window as { __wxjs_environment?: string }).__wxjs_environment,
        }),
        isMobile: window.matchMedia("(max-width: 768px)").matches,
        search: window.location.search,
      }),
    () => SERVER_CLIENT_ENV_SNAPSHOT,
  );
  const clientEnv = useMemo(
    () =>
      JSON.parse(clientEnvSnapshot) as {
        isInMiniProgram: boolean;
        isMobile: boolean;
        search: string;
      },
    [clientEnvSnapshot],
  );
  const shouldShowRedirect = useMemo(() => {
    if (isRedirectDismissed) {
      return false;
    }

    return shouldAutoRedirectToMiniProgram({
      isInMiniProgram: clientEnv.isInMiniProgram,
      isMobile: clientEnv.isMobile,
      miniProgramUrl: miniProgramConfig.miniProgramUrl,
      search: clientEnv.search,
    });
  }, [clientEnv, isRedirectDismissed, miniProgramConfig.miniProgramUrl]);
  const activeEntry = useMemo(
    () => testCatalog.find((entry) => entry.slug === activeSlug) ?? testCatalog[0],
    [activeSlug],
  );

  useEffect(() => {
    if (!shouldShowRedirect) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      window.location.href = miniProgramConfig.miniProgramUrl;
    }, 1200);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [miniProgramConfig.miniProgramUrl, shouldShowRedirect]);

  if (shouldShowRedirect) {
    return (
      <main className="px-4 pb-16 pt-16">
        <section className="mx-auto max-w-[920px] rounded-[28px] border border-[var(--line)] bg-[var(--panel)] px-6 py-12 text-center shadow-[0_18px_44px_rgba(26,42,34,0.06)] md:px-10">
          <h1 className="text-3xl font-semibold tracking-[-0.03em] text-[var(--foreground)] md:text-5xl">
            正在跳转到微信小程序...
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-[var(--muted)]">
            请稍候，即将为你打开 {miniProgramConfig.appName}。如果你只是想继续浏览网页，也可以取消跳转。
          </p>
          <button
            className="mt-8 rounded-2xl border border-[var(--line)] bg-white px-6 py-3 text-base font-semibold text-[var(--accent-strong)] transition hover:-translate-y-0.5"
            onClick={() => setIsRedirectDismissed(true)}
            type="button"
          >
            取消跳转，继续浏览网页
          </button>
        </section>
      </main>
    );
  }

  return (
    <main className="px-4 pb-16 pt-8">
      <section className="mx-auto max-w-[1120px] rounded-[28px] border border-[var(--line)] bg-[var(--panel)] px-6 py-10 shadow-[0_18px_44px_rgba(26,42,34,0.06)] md:px-10 md:py-12">
        <div className="max-w-3xl">
          <div
            className="inline-flex flex-wrap items-center gap-x-5 gap-y-1 rounded-full border border-[var(--line)] bg-[var(--soft)] px-5 py-2 text-xs font-semibold text-[var(--accent-strong)]"
            data-testid="home-library-chip"
          >
            <span className="tracking-[0.16em]">PERSONA TEST LIBRARY</span>
            <span className="tracking-[0.1em]">人格测评库</span>
          </div>
          <h1 className="mt-6 text-4xl font-semibold tracking-[-0.04em] text-[var(--foreground)] md:text-6xl">
            人格测试题库
          </h1>
        </div>

        {!clientEnv.isInMiniProgram && !clientEnv.isMobile ? (
          <div className="mt-8 hidden rounded-[24px] border border-[var(--line)] bg-[linear-gradient(180deg,#fbfefb,#f4faf5)] p-5 md:block md:p-6">
            <div className="flex flex-col justify-center">
              <div className="inline-flex w-fit rounded-full bg-[var(--soft)] px-3 py-1.5 text-xs font-semibold tracking-[0.14em] text-[var(--accent-strong)]">
                微信小程序入口
              </div>
              <h2 className="mt-4 text-2xl font-semibold tracking-[-0.03em] text-[var(--foreground)]">
                小橙有门 · 微信内更方便
              </h2>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  className="inline-flex items-center justify-center rounded-2xl bg-[var(--accent-strong)] px-5 py-3 font-semibold text-white shadow-[0_12px_24px_rgba(77,106,83,0.16)] transition hover:-translate-y-0.5"
                  href={miniProgramConfig.miniProgramUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  打开微信小程序
                </a>
                <button
                  className="inline-flex items-center justify-center rounded-2xl border border-[var(--line)] bg-white px-5 py-3 font-semibold text-[var(--accent-strong)] transition hover:-translate-y-0.5"
                  onClick={() => setIsQrPreviewVisible((current) => !current)}
                  type="button"
                >
                  {isQrPreviewVisible ? "收起小程序码" : "下载小程序码"}
                </button>
              </div>

              {isQrPreviewVisible ? (
                <div
                  className="mt-6 rounded-[24px] border border-[var(--line)] bg-white/90 p-4 shadow-[0_16px_40px_rgba(26,42,34,0.04)]"
                  data-testid="mini-program-qr-preview"
                >
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <div className="relative h-40 w-40 shrink-0 overflow-hidden rounded-[18px] border border-[var(--line)] bg-white">
                      <Image
                        alt={`${miniProgramConfig.appName}二维码`}
                        className="object-contain p-2"
                        fill
                        sizes="160px"
                        src={miniProgramConfig.qrCodeUrl}
                      />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-base font-semibold text-[var(--foreground)]">
                        小程序码预览
                      </h3>
                      <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
                        可直接保存图片，或长按识别进入小程序。
                      </p>
                      <a
                        className="mt-4 inline-flex items-center justify-center rounded-2xl border border-[var(--line)] bg-[var(--soft)] px-4 py-2 font-semibold text-[var(--accent-strong)] transition hover:-translate-y-0.5"
                        download
                        href={miniProgramConfig.qrCodeUrl}
                      >
                        下载原图
                      </a>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        ) : null}

        <div
          className="mt-10 rounded-[24px] border border-[var(--line)] bg-[linear-gradient(180deg,#fdfefd,#f7fbf8)] p-4 md:p-6"
          data-testid="home-library-grid-shell"
        >
          <div className="grid grid-cols-3 gap-2 lg:hidden">
            {testCatalog.map((entry) => {
              const isActive = entry.slug === activeEntry.slug;

              return (
                <button
                  aria-pressed={isActive}
                  className={`rounded-2xl border px-3 py-3 text-sm font-semibold tracking-[0.08em] transition ${
                    isActive
                      ? "border-[var(--accent-strong)] bg-[var(--accent-strong)] text-white"
                      : "border-[var(--line)] bg-white text-[var(--muted)]"
                  }`}
                  key={entry.slug}
                  onClick={() => setActiveSlug(entry.slug)}
                  type="button"
                >
                  {entry.slug.toUpperCase()}
                </button>
              );
            })}
          </div>

          <div className="mt-4 lg:hidden">
            <TestEntryCard compact entry={activeEntry} />
          </div>

          <div className="hidden gap-5 lg:grid lg:grid-cols-3">
            {testCatalog.map((entry) => (
              <TestEntryCard entry={entry} key={entry.slug} />
            ))}
          </div>
        </div>
      </section>
      <SeoGeoSections />
    </main>
  );
}
