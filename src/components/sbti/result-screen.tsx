"use client";

import { toPng } from "html-to-image";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

import { DimensionList } from "@/components/sbti/dimension-list";
import { ShareQrWatermark } from "@/components/shared/share-qr-watermark";
import { sbtiPreviewImageUrl } from "@/lib/asset-urls";
import { typeImages } from "@/lib/sbti-data";
import type { SbtiResult } from "@/lib/sbti-engine";
import {
  buildResultShareMeta,
  dataUrlToBlob,
  inlineShareCardImages,
  isNativeShareSupported,
  isWechatBrowser,
} from "@/lib/result-share";
import { buildWechatShareLink, syncWechatShareData } from "@/lib/wechat-share";

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
  const imageSrc = typeImages[result.finalType.code];
  const shareCardRef = useRef<HTMLDivElement>(null);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [shareImageUrl, setShareImageUrl] = useState<string | null>(null);
  const [isWechatShareReady, setIsWechatShareReady] = useState(false);
  const [shareMessage, setShareMessage] = useState("");
  const shareMeta = useMemo(
    () =>
      buildResultShareMeta({
        code: result.finalType.code,
        label: `${result.finalType.code}（${result.finalType.cn}）`,
        quizName: "SBTI 人格测试",
        slug: "sbti",
        summary: result.sub,
      }),
    [result.finalType.cn, result.finalType.code, result.sub],
  );

  useEffect(() => {
    return () => {
      if (shareImageUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(shareImageUrl);
      }
    };
  }, [shareImageUrl]);

  useEffect(() => {
    if (!isWechatBrowser() || typeof window === "undefined") {
      setIsWechatShareReady(false);
      return;
    }

    let cancelled = false;

    void syncWechatShareData({
      desc: shareMeta.summary,
      imgUrl: imageSrc ?? sbtiPreviewImageUrl,
      link: buildWechatShareLink({
        origin: window.location.origin,
        slug: "sbti",
      }),
      title: shareMeta.title,
    })
      .then((ready) => {
        if (!cancelled) {
          setIsWechatShareReady(ready);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setIsWechatShareReady(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [imageSrc, shareMeta.summary, shareMeta.title]);

  useEffect(() => {
    if (!isShareOpen) {
      return;
    }

    void ensureShareImage();
  }, [isShareOpen]);

  async function ensureShareImage() {
    if (shareImageUrl) {
      return shareImageUrl;
    }

    if (!shareCardRef.current) {
      return null;
    }

    setShareMessage("");

    try {
      await inlineShareCardImages(shareCardRef.current);

      const dataUrl = await toPng(shareCardRef.current, {
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
      // no-op
    }
  }

  async function handleOpenShare() {
    setIsShareOpen(true);
    setShareMessage("");
  }

  async function handleNativeShare() {
    const imageUrl = await ensureShareImage();

    if (!imageUrl) {
      return;
    }

    if (!isNativeShareSupported()) {
      if (isWechatBrowser()) {
        setShareMessage(
          isWechatShareReady
            ? "微信分享卡片已启用，请点击右上角“…”发送给朋友或朋友圈；也可以长按预览图保存到相册。"
            : "微信分享卡片初始化失败，可长按图片保存后再转发。",
        );
        return;
      }

      setShareMessage("当前浏览器不支持系统分享，可长按图片保存后再转发。");
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
      setShareMessage("系统分享未完成，可长按图片保存后再转发。");
    }
  }

  return (
    <section className="w-full">
      <div className="px-4 pb-14 pt-6">
        <div className="mx-auto max-w-[980px] rounded-[22px] border border-[var(--line)] bg-[var(--panel)] p-6 shadow-[0_16px_40px_rgba(47,73,55,0.08)] md:p-7">
          <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
            <div
              className="rounded-[24px] border border-[var(--line)] bg-[linear-gradient(180deg,#fbfefb,#f3f8f4)] p-4"
              id="posterBox"
            >
              {imageSrc ? (
                <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[18px] bg-white">
                  <Image
                    alt={`${result.finalType.code}（${result.finalType.cn}）`}
                    className="object-contain p-2"
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

              <div className="rounded-[24px] border border-[var(--line)] bg-[linear-gradient(180deg,#ffffff,#fbfdfb)] p-5">
                <div className="text-sm font-medium text-[var(--muted)]">结果操作</div>
                <div className="mt-4 space-y-3">
                  <button
                    className="w-full rounded-2xl bg-[var(--accent-strong)] px-5 py-3 font-semibold text-white shadow-[0_12px_30px_rgba(77,106,83,0.18)] transition hover:-translate-y-0.5"
                    onClick={() => {
                      void handleOpenShare();
                    }}
                    type="button"
                  >
                    分享结果
                  </button>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                    <button
                      className="w-full rounded-2xl border border-[var(--line)] bg-white px-5 py-3 font-semibold text-[var(--accent-strong)] transition hover:-translate-y-0.5"
                      id="restartBtn"
                      onClick={onRestart}
                      type="button"
                    >
                      重新测试
                    </button>
                    <button
                      className="w-full rounded-2xl border border-[var(--line)] bg-white px-5 py-3 font-semibold text-[var(--accent-strong)] transition hover:-translate-y-0.5"
                      id="toTopBtn"
                      onClick={onToTop}
                      type="button"
                    >
                      回到首页
                    </button>
                  </div>
                </div>
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
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 p-0 sm:items-center sm:p-4"
            onClick={() => setIsShareOpen(false)}
            role="dialog"
          >
            <div
              className="flex max-h-[88vh] w-full max-w-md flex-col overflow-y-auto rounded-t-[24px] border border-[var(--line)] bg-[var(--panel)] p-6 shadow-[0_16px_40px_rgba(47,73,55,0.2)] sm:rounded-[24px]"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2
                    className="text-xl font-semibold text-[var(--foreground)]"
                    id="shareResultTitle"
                  >
                    分享这张结果图
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
                    分享图会包含人格主图、类型标题和匹配信息。
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
                  <img
                    alt={`${result.finalType.code}（${result.finalType.cn}）分享预览图`}
                    className="mx-auto w-full max-w-sm rounded-[24px] border border-[#dbe8dd] bg-[#f6faf6]"
                    src={shareImageUrl}
                  />
                ) : (
                  <div className="mx-auto flex w-full max-w-sm items-center justify-center rounded-[24px] border border-[#dbe8dd] bg-[#f6faf6] px-6 py-16 text-sm text-[#6a786f]">
                    正在生成分享图片...
                  </div>
                )}

                <div className="pointer-events-none absolute left-0 top-0 -z-10 opacity-0">
                  <div
                    className="w-[720px] rounded-[24px] bg-[#f6faf6] p-6 text-[#1e2a22]"
                    ref={shareCardRef}
                    style={{
                      fontFamily:
                        '-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif',
                    }}
                  >
                    <div className="relative rounded-[22px] border border-[#dbe8dd] bg-white p-5 shadow-[0_16px_40px_rgba(47,73,55,0.08)]">
                      <div className="text-sm font-medium tracking-[0.28em] text-[#6c8d71]">
                        SBTI RESULT
                      </div>
                      <div className="mt-5">
                        {imageSrc ? (
                          <img
                            alt=""
                            src={imageSrc}
                            style={{
                              background: "#fff",
                              borderRadius: "18px",
                              display: "block",
                              height: "auto",
                              padding: "8px",
                              width: "100%",
                            }}
                          />
                        ) : null}
                      </div>

                      <div
                        style={{
                          background: "#fbfefb",
                          border: "1px solid #dbe8dd",
                          borderRadius: "18px",
                          marginTop: "18px",
                          padding: "20px",
                        }}
                      >
                        <div style={{ color: "#6a786f", fontSize: "20px", lineHeight: 1.5 }}>
                          {result.modeKicker}
                        </div>
                        <div
                          style={{
                            fontSize: "42px",
                            fontWeight: 700,
                            letterSpacing: "-0.03em",
                            lineHeight: 1.2,
                            marginTop: "12px",
                          }}
                        >
                          {result.finalType.code}（{result.finalType.cn}）
                        </div>
                        <div
                          style={{
                            background: "#edf6ef",
                            borderRadius: "999px",
                            color: "#4d6a53",
                            display: "inline-block",
                            fontSize: "20px",
                            fontWeight: 600,
                            lineHeight: 1.5,
                            marginTop: "18px",
                            padding: "10px 16px",
                          }}
                        >
                          {result.badge}
                        </div>
                        <div
                          style={{
                            color: "#6a786f",
                            fontSize: "22px",
                            lineHeight: 1.7,
                            marginTop: "18px",
                          }}
                        >
                          {shareMeta.summary}
                        </div>
                        <div
                          style={{
                            borderTop: "1px solid #dbe8dd",
                            marginTop: "18px",
                            paddingTop: "16px",
                          }}
                        >
                          <ShareQrWatermark />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <button
                className="mt-5 rounded-2xl bg-[var(--accent-strong)] px-5 py-3 font-semibold text-white shadow-[0_12px_30px_rgba(77,106,83,0.18)] transition hover:-translate-y-0.5"
                onClick={() => {
                  void handleNativeShare();
                }}
                type="button"
              >
                立即分享
              </button>

              <div className="mt-4 rounded-2xl bg-[var(--soft)] px-4 py-3 text-sm leading-7 text-[var(--muted)]">
                {isWechatBrowser()
                  ? "如果你在微信里，可以点击右上角“…”把结果图分享给朋友或朋友圈；也可以长按预览图保存到相册。"
                  : "移动端可用系统分享；如果系统分享面板没有保存入口，也可以长按预览图保存图片。桌面端可右键另存为。"}
              </div>

              {shareMessage ? (
                <p className="mt-3 text-sm text-[var(--accent-strong)]">
                  {shareMessage}
                </p>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
