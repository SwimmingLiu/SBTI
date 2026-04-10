"use client";

import { toPng } from "html-to-image";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

import { DimensionList } from "@/components/sbti/dimension-list";
import { typeImages } from "@/lib/sbti-data";
import type { SbtiResult } from "@/lib/sbti-engine";
import {
  buildResultShareMeta,
  dataUrlToBlob,
  isNativeShareSupported,
  isWechatBrowser,
} from "@/lib/result-share";

type ResultScreenProps = {
  onRestart: () => void;
  onToTop: () => void;
  result: SbtiResult;
};

function getFunNote(result: SbtiResult) {
  return result.special
    ? "本测试仅供娱乐。隐藏人格和傻乐兜底都属于作者故意埋的损招，请勿把它当成医学、心理学、相学、命理学或灵异学依据。"
    : "本测试仅供娱乐，别拿它当诊断、面试、相亲、分手、招魂、算命或人生判决书。你可以笑，但别太当真。";
}

export function ResultScreen({
  onRestart,
  onToTop,
  result,
}: ResultScreenProps) {
  const captureRef = useRef<HTMLDivElement>(null);
  const imageSrc = typeImages[result.finalType.code];
  const [isPreparingShareImage, setIsPreparingShareImage] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [shareImageUrl, setShareImageUrl] = useState<string | null>(null);
  const [shareMessage, setShareMessage] = useState("");
  const shareMeta = useMemo(
    () =>
      buildResultShareMeta({
        badge: result.badge,
        cn: result.finalType.cn,
        code: result.finalType.code,
      }),
    [result.badge, result.finalType.cn, result.finalType.code],
  );

  useEffect(() => {
    return () => {
      if (shareImageUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(shareImageUrl);
      }
    };
  }, [shareImageUrl]);

  async function ensureShareImage() {
    if (shareImageUrl) {
      return shareImageUrl;
    }

    if (!captureRef.current) {
      return null;
    }

    setIsPreparingShareImage(true);
    setShareMessage("");

    try {
      const dataUrl = await toPng(captureRef.current, {
        backgroundColor: "#f6faf6",
        cacheBust: true,
        pixelRatio: 2,
      });
      setShareImageUrl(dataUrl);
      return dataUrl;
    } catch {
      setShareMessage("结果图生成失败，请稍后重试。");
      return null;
    } finally {
      setIsPreparingShareImage(false);
    }
  }

  async function handleOpenShare() {
    setIsShareOpen(true);
    await ensureShareImage();
  }

  async function handleNativeShare() {
    const imageUrl = await ensureShareImage();

    if (!imageUrl) {
      return;
    }

    if (!isNativeShareSupported()) {
      setShareMessage("当前浏览器不支持系统分享，可改用保存图片或复制文案。");
      return;
    }

    try {
      const blob = dataUrlToBlob(imageUrl);
      const file = new File([blob], shareMeta.fileName, { type: blob.type });
      const sharePayload: ShareData = {
        text: shareMeta.text,
        title: shareMeta.title,
      };

      if (
        typeof navigator.canShare === "function" &&
        navigator.canShare({ files: [file] })
      ) {
        sharePayload.files = [file];
      }

      await navigator.share(sharePayload);
      setShareMessage("已打开系统分享。");
    } catch {
      setShareMessage("系统分享未完成，可改用保存图片或复制文案。");
    }
  }

  async function handleSaveImage() {
    const imageUrl = await ensureShareImage();

    if (!imageUrl) {
      return;
    }

    const link = document.createElement("a");
    link.href = imageUrl;
    link.download = shareMeta.fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setShareMessage("结果图已开始下载。");
  }

  async function handleCopyText() {
    try {
      await navigator.clipboard.writeText(shareMeta.text);
      setShareMessage("分享文案已复制。");
    } catch {
      setShareMessage("复制失败，请手动复制结果文案。");
    }
  }

  return (
    <section className="w-full">
      <div className="px-4 pb-14 pt-6">
        <div
          className="mx-auto max-w-[980px] rounded-[22px] border border-[var(--line)] bg-[var(--panel)] p-6 shadow-[0_16px_40px_rgba(47,73,55,0.08)] md:p-7"
          ref={captureRef}
        >
          <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
            <div
              className="rounded-[24px] border border-[var(--line)] bg-[linear-gradient(180deg,#fbfefb,#f3f8f4)] p-4"
              id="posterBox"
            >
              {imageSrc ? (
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[18px]">
                  <Image
                    alt={`${result.finalType.code}（${result.finalType.cn}）`}
                    className="object-cover"
                    fill
                    id="posterImage"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    src={imageSrc}
                  />
                </div>
              ) : (
                <div className="flex min-h-[320px] items-center justify-center rounded-[18px] bg-[var(--soft)] text-[var(--muted)]">
                  图片缺失
                </div>
              )}
              <div
                className="mt-3 rounded-2xl bg-white px-4 py-3 text-sm text-[var(--muted)]"
                id="posterCaption"
              >
                {result.finalType.intro}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <div className="rounded-[24px] border border-[var(--line)] bg-[linear-gradient(180deg,#ffffff,#fbfdfb)] p-5">
                <div className="text-sm text-[var(--muted)]" id="resultModeKicker">
                  {result.modeKicker}
                </div>
                <div
                  className="mt-2 text-3xl font-semibold tracking-[-0.03em] text-[var(--foreground)] md:text-4xl"
                  id="resultTypeName"
                >
                  {result.finalType.code}（{result.finalType.cn}）
                </div>
                <div
                  className="mt-3 inline-flex rounded-full bg-[var(--soft)] px-3 py-1.5 text-sm font-medium text-[var(--accent-strong)]"
                  id="matchBadge"
                >
                  {result.badge}
                </div>
                <div
                  className="mt-3 text-sm leading-6 text-[var(--muted)]"
                  id="resultTypeSub"
                >
                  {result.sub}
                </div>
              </div>

              <div className="rounded-[24px] border border-[var(--line)] bg-white p-5">
                <h2 className="text-lg font-semibold text-[var(--foreground)]">
                  该人格的简单解读
                </h2>
                <p
                  className="mt-3 whitespace-pre-wrap text-sm leading-7 text-[var(--muted)]"
                  id="resultDesc"
                >
                  {result.finalType.desc}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-[24px] border border-[var(--line)] bg-[linear-gradient(180deg,#ffffff,#fbfdfb)] p-5">
            <h2 className="text-lg font-semibold text-[var(--foreground)]">
              十五维度评分
            </h2>
            <div className="mt-4" id="dimList">
              <DimensionList result={result} />
            </div>
          </div>

          <div className="mt-4 rounded-[24px] border border-[var(--line)] bg-white p-5">
            <h2 className="text-lg font-semibold text-[var(--foreground)]">
              友情提示
            </h2>
            <p className="mt-3 text-sm leading-7 text-[var(--muted)]" id="funNote">
              {getFunNote(result)}
            </p>
          </div>
        </div>

        {isShareOpen ? (
          <div
            aria-labelledby="shareResultTitle"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4"
            role="dialog"
          >
            <div className="w-full max-w-md rounded-[24px] border border-[var(--line)] bg-[var(--panel)] p-6 shadow-[0_16px_40px_rgba(47,73,55,0.2)]">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2
                    className="text-xl font-semibold text-[var(--foreground)]"
                    id="shareResultTitle"
                  >
                    分享这张结果图
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                    生成结果截图后，你可以分享给朋友、朋友圈，或者保存到相册。
                  </p>
                </div>
                <button
                  aria-label="Close share dialog"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--line)] text-[var(--muted)] transition hover:border-[var(--accent)] hover:text-[var(--foreground)]"
                  onClick={() => setIsShareOpen(false)}
                  type="button"
                >
                  <svg
                    aria-hidden="true"
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M6 6L18 18M18 6L6 18"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeWidth="2"
                    />
                  </svg>
                </button>
              </div>

              <div className="mt-5 rounded-[20px] border border-[var(--line)] bg-white p-4">
                {shareImageUrl ? (
                  <div className="relative mx-auto aspect-[3/4] w-full overflow-hidden rounded-xl">
                    <Image
                      alt="结果页分享预览"
                      className="object-contain"
                      fill
                      sizes="(max-width: 640px) 100vw, 384px"
                      src={shareImageUrl}
                      unoptimized
                    />
                  </div>
                ) : (
                  <div className="flex min-h-[220px] items-center justify-center rounded-xl bg-[var(--soft)] text-sm text-[var(--muted)]">
                    {isPreparingShareImage ? "正在生成结果图..." : "准备分享结果图"}
                  </div>
                )}
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                <button
                  className="rounded-2xl bg-[var(--accent-strong)] px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(77,106,83,0.18)] transition hover:-translate-y-0.5"
                  onClick={() => {
                    void handleNativeShare();
                  }}
                  type="button"
                >
                  系统分享
                </button>
                <button
                  className="rounded-2xl border border-[var(--line)] bg-white px-4 py-3 text-sm font-semibold text-[var(--accent-strong)] transition hover:-translate-y-0.5"
                  onClick={() => {
                    void handleSaveImage();
                  }}
                  type="button"
                >
                  保存图片
                </button>
                <button
                  className="rounded-2xl border border-[var(--line)] bg-white px-4 py-3 text-sm font-semibold text-[var(--accent-strong)] transition hover:-translate-y-0.5"
                  onClick={() => {
                    void handleCopyText();
                  }}
                  type="button"
                >
                  复制文案
                </button>
              </div>

              <div className="mt-4 rounded-2xl bg-[var(--soft)] px-4 py-3 text-sm leading-6 text-[var(--muted)]">
                {isWechatBrowser()
                  ? "如果你在微信里，可以点击右上角“…”把结果图分享给朋友或朋友圈，也可以先保存图片再发送。"
                  : "移动端支持系统分享；如分享面板不可用，可先保存结果图，再发送给朋友或朋友圈。"}
              </div>

              {shareMessage ? (
                <p className="mt-3 text-sm text-[var(--accent-strong)]">
                  {shareMessage}
                </p>
              ) : null}
            </div>
          </div>
        ) : null}

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            className="rounded-2xl bg-[var(--accent-strong)] px-5 py-3 font-semibold text-white shadow-[0_12px_30px_rgba(77,106,83,0.18)] transition hover:-translate-y-0.5"
            onClick={() => {
              void handleOpenShare();
            }}
            type="button"
          >
            分享结果
          </button>
          <button
            className="rounded-2xl border border-[var(--line)] bg-white px-5 py-3 font-semibold text-[var(--accent-strong)] transition hover:-translate-y-0.5"
            onClick={() => {
              void handleSaveImage();
            }}
            type="button"
          >
            保存图片
          </button>
          <button
            className="rounded-2xl border border-[var(--line)] bg-white px-5 py-3 font-semibold text-[var(--accent-strong)] transition hover:-translate-y-0.5"
            id="restartBtn"
            onClick={onRestart}
            type="button"
          >
            重新测试
          </button>
          <button
            className="rounded-2xl bg-[var(--accent-strong)] px-5 py-3 font-semibold text-white shadow-[0_12px_30px_rgba(77,106,83,0.18)] transition hover:-translate-y-0.5"
            id="toTopBtn"
            onClick={onToTop}
            type="button"
          >
            回到首页
          </button>
        </div>
      </div>
    </section>
  );
}
