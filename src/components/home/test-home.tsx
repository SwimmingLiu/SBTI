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
import { testCatalog } from "@/lib/test-catalog";

const SERVER_CLIENT_ENV_SNAPSHOT = JSON.stringify({
  isInMiniProgram: false,
  isMobile: false,
  search: "",
});

export function TestHome() {
  const miniProgramConfig = useMemo(() => getMiniProgramConfig(), []);
  const [isRedirectDismissed, setIsRedirectDismissed] = useState(false);
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
          <div className="inline-flex rounded-full border border-[var(--line)] bg-[var(--soft)] px-3 py-2 text-xs font-semibold tracking-[0.16em] text-[var(--accent-strong)]">
            PERSONA TEST LIBRARY
          </div>
          <h1 className="mt-6 text-4xl font-semibold tracking-[-0.04em] text-[var(--foreground)] md:text-6xl">
            人格测试题库
          </h1>
        </div>

        {!clientEnv.isInMiniProgram ? (
          <div className="mt-8 grid gap-5 rounded-[24px] border border-[var(--line)] bg-[linear-gradient(180deg,#fbfefb,#f4faf5)] p-5 md:grid-cols-[0.9fr_1.1fr] md:p-6">
            <div className="flex justify-center md:justify-start">
              <div className="rounded-[24px] border border-[var(--line)] bg-white p-4 shadow-[0_16px_40px_rgba(26,42,34,0.04)]">
                <div className="relative h-40 w-40 overflow-hidden rounded-[18px]">
                  <Image
                    alt={`${miniProgramConfig.appName}二维码`}
                    className="object-contain"
                    fill
                    sizes="160px"
                    src={miniProgramConfig.qrCodeUrl}
                  />
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-center">
              <div className="inline-flex w-fit rounded-full bg-[var(--soft)] px-3 py-1.5 text-xs font-semibold tracking-[0.14em] text-[var(--accent-strong)]">
                微信小程序入口
              </div>
              <h2 className="mt-4 text-2xl font-semibold tracking-[-0.03em] text-[var(--foreground)]">
                小橙有门 · 微信内更方便
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--muted)]">
                首页直接提供小程序二维码和跳转入口。移动端访问时会优先尝试跳小程序；如果你正在微信小程序内，则不会重复展示这块内容。
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  className="inline-flex items-center justify-center rounded-2xl bg-[var(--accent-strong)] px-5 py-3 font-semibold text-white shadow-[0_12px_24px_rgba(77,106,83,0.16)] transition hover:-translate-y-0.5"
                  href={miniProgramConfig.miniProgramUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  打开微信小程序
                </a>
                <a
                  className="inline-flex items-center justify-center rounded-2xl border border-[var(--line)] bg-white px-5 py-3 font-semibold text-[var(--accent-strong)] transition hover:-translate-y-0.5"
                  download
                  href={miniProgramConfig.qrCodeUrl}
                >
                  下载小程序码
                </a>
              </div>
            </div>
          </div>
        ) : null}

        <div className="mt-10 grid gap-5 lg:grid-cols-3">
          {testCatalog.map((entry) => (
            <TestEntryCard entry={entry} key={entry.slug} />
          ))}
        </div>
      </section>
      <SeoGeoSections />
    </main>
  );
}
