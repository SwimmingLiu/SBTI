"use client";

import { toPng } from "html-to-image";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";

import { ShareQrWatermark } from "@/components/shared/share-qr-watermark";
import { sbtiPreviewImageUrl } from "@/lib/asset-urls";
import {
  sdtiQuestions,
  sdtiSingleChoiceCount,
  type SdtiQuestion,
} from "@/features/sdti/data";
import { computeSdtiResult } from "@/features/sdti/engine";
import {
  isCurrentMiniProgramWebView,
  postMiniProgramShareMessage,
} from "@/lib/mini-program";
import {
  buildResultShareMeta,
  dataUrlToBlob,
  inlineShareCardImages,
  isNativeShareSupported,
  isWechatBrowser,
} from "@/lib/result-share";
import { buildWechatShareLink, syncWechatShareData } from "@/lib/wechat-share";

type Screen = "quiz" | "result";

function SdtiQuestionBlock({
  answers,
  multiAnswers,
  onToggleMulti,
  onSelectSingle,
  question,
}: {
  answers: Record<string, string>;
  multiAnswers: Record<string, string[]>;
  onToggleMulti: (questionNumber: number, optionKey: string) => void;
  onSelectSingle: (questionNumber: number, optionKey: string) => void;
  question: SdtiQuestion;
}) {
  const selectedValue = answers[String(question.n)];
  const selectedMulti = multiAnswers[String(question.n)] ?? [];

  return (
    <article className="rounded-[22px] border border-[#d8d8d8] bg-white p-5">
      <div className="mb-3 text-xs tracking-[0.08em] text-[#8b8b8b]">
        第 {question.n} 题 · {question.multi ? "补充题 · 可多选" : "维度已隐藏"}
      </div>
      {question.longText ? (
        <div className="rounded-[18px] bg-[#f5f5f5] px-4 py-4 text-sm leading-8 text-[#444]">
          {question.text}
        </div>
      ) : (
        <h2 className="text-base font-medium leading-8 text-[#222]">{question.text}</h2>
      )}

      <div className="mt-4 flex flex-col gap-3">
        {question.opts.map((option) => {
          const selected = question.multi
            ? selectedMulti.includes(option.k)
            : selectedValue === option.k;

          return (
            <button
              className={`flex items-start gap-3 border px-4 py-3 text-left text-sm transition ${
                selected
                  ? "border-[#222] bg-[#222] text-white"
                  : "border-[#ddd] bg-white text-[#222] hover:border-[#999] hover:bg-[#f5f5f5]"
              }`}
              data-opt={option.k}
              data-q={question.n}
              key={`${question.n}-${option.k}`}
              onClick={() => {
                if (question.multi) {
                  onToggleMulti(question.n, option.k);
                  return;
                }

                onSelectSingle(question.n, option.k);
              }}
              type="button"
            >
              <span className="min-w-4 font-semibold">{option.k}</span>
              <span>{option.t}</span>
            </button>
          );
        })}
      </div>
    </article>
  );
}

export function SdtiApp() {
  const isMiniProgramWebView = isCurrentMiniProgramWebView();
  const [screen, setScreen] = useState<Screen>("quiz");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [multiAnswers, setMultiAnswers] = useState<Record<string, string[]>>({});
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [shareImageUrl, setShareImageUrl] = useState<string | null>(null);
  const [isWechatShareReady, setIsWechatShareReady] = useState(false);
  const [shareMessage, setShareMessage] = useState("");
  const shareCardRef = useRef<HTMLDivElement>(null);
  const result = useMemo(() => computeSdtiResult(answers), [answers]);
  const shareMeta = useMemo(
    () =>
      buildResultShareMeta({
        code: result.name,
        label: result.name,
        quizName: "SDTI 人格测评",
        slug: "sdti",
        summary: result.desc,
      }),
    [result.desc, result.name],
  );

  useEffect(() => {
    return () => {
      if (shareImageUrl?.startsWith("blob:")) {
        URL.revokeObjectURL(shareImageUrl);
      }
    };
  }, [shareImageUrl]);

  useEffect(() => {
    if (screen !== "result" || typeof window === "undefined") {
      setIsWechatShareReady(false);
      return;
    }

    const shareContent = {
      desc: shareMeta.summary,
      imgUrl: result.image ?? sbtiPreviewImageUrl,
      link: buildWechatShareLink({
        origin: window.location.origin,
        slug: "sdti",
      }),
      title: shareMeta.title,
    };

    if (isMiniProgramWebView) {
      setIsWechatShareReady(postMiniProgramShareMessage(shareContent));
      return;
    }

    if (!isWechatBrowser()) {
      setIsWechatShareReady(false);
      return;
    }

    let cancelled = false;

    void syncWechatShareData(shareContent)
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
  }, [isMiniProgramWebView, result.image, screen, shareMeta.summary, shareMeta.title]);

  useEffect(() => {
    if (!isShareOpen) {
      return;
    }

    void ensureShareImage();
  }, [isShareOpen]);

  function handleSelectSingle(questionNumber: number, optionKey: string) {
    setAnswers((current) => ({
      ...current,
      [String(questionNumber)]: optionKey,
    }));
  }

  function handleToggleMulti(questionNumber: number, optionKey: string) {
    setMultiAnswers((current) => {
      const key = String(questionNumber);
      const currentValues = current[key] ?? [];
      const nextValues = currentValues.includes(optionKey)
        ? currentValues.filter((value) => value !== optionKey)
        : [...currentValues, optionKey];

      return {
        ...current,
        [key]: nextValues,
      };
    });
  }

  function handleSubmit() {
    const answered = Object.keys(answers).length;

    if (answered < sdtiSingleChoiceCount) {
      const confirmed = window.confirm(
        `还有 ${sdtiSingleChoiceCount - answered} 题没答，确定提交？`,
      );

      if (!confirmed) {
        return;
      }
    }

    setScreen("result");
    window.scrollTo({ behavior: "smooth", top: 0 });
  }

  function handleRestart() {
    setAnswers({});
    setMultiAnswers({});
    setScreen("quiz");
    setShareImageUrl(null);
    window.scrollTo({ behavior: "smooth", top: 0 });
  }

  async function ensureShareImage() {
    if (shareImageUrl) {
      return shareImageUrl;
    }

    try {
      await inlineShareCardImages(shareCardRef.current);
      const dataUrl = await toPng(shareCardRef.current!, {
        backgroundColor: "#f8f8f8",
        cacheBust: true,
        pixelRatio: 2,
      });
      setShareImageUrl(dataUrl);
      return dataUrl;
    } catch {
      setShareMessage("结果图生成失败，请稍后重试。");
      return null;
    }
  }

  async function openShare() {
    setIsShareOpen(true);
    setShareMessage("");
  }

  async function handleNativeShare() {
    const imageUrl = await ensureShareImage();

    if (!imageUrl) {
      return;
    }

    if (isMiniProgramWebView) {
      setShareMessage(
        isWechatShareReady
          ? "分享信息已同步给小程序，请点击右上角“…”完成转发；也可以长按图片保存。"
          : "当前处于微信小程序内，但分享桥接尚未接通，可长按图片保存。",
      );
      return;
    }

    if (!isNativeShareSupported()) {
      if (isWechatBrowser()) {
        setShareMessage(
          isWechatShareReady
            ? "微信分享卡片已启用，请点击右上角“…”发送给朋友或朋友圈；也可以长按图片保存。"
            : "微信分享卡片初始化失败，可长按图片保存。",
        );
        return;
      }

      setShareMessage("当前浏览器不支持系统分享，可长按图片保存。");
      return;
    }

    try {
      const blob = dataUrlToBlob(imageUrl);
      const file = new File([blob], shareMeta.fileName, { type: blob.type });
      const payload: ShareData = {
        text: shareMeta.text,
        title: shareMeta.title,
      };

      if (
        typeof navigator.canShare === "function" &&
        navigator.canShare({ files: [file] })
      ) {
        payload.files = [file];
      }

      await navigator.share(payload);
      setShareMessage("已打开系统分享。");
    } catch {
      setShareMessage("系统分享未完成，可长按图片保存。");
    }
  }

  const shareActionLabel = isMiniProgramWebView ? "去微信菜单分享" : "立即分享";

  if (screen === "result") {
    return (
      <section className="px-4 pb-16 pt-8">
        <div
          className="mx-auto max-w-[760px] rounded-[24px] border border-[#d9d9d9] bg-white px-6 py-8 shadow-[0_20px_48px_rgba(0,0,0,0.06)]"
          id="result"
        >
          <header className="border-b border-[#ddd] pb-6 text-center">
            <h2 className="text-sm text-[#888]">你的人格类型是</h2>
            <div className="mt-3 text-4xl font-bold tracking-[-0.03em] text-[#111]">
              <span id="result-type">{result.name}</span>
            </div>
          </header>

          <div className="mt-8 space-y-6">
            <p
              className="whitespace-pre-line text-[15px] leading-8 text-[#333]"
              id="result-desc"
            >
              {result.desc}
            </p>

            {result.image ? (
              <div className="space-y-3">
                <div className="relative mx-auto aspect-[3/4] w-full max-w-[300px] overflow-hidden rounded-md border border-[#eee]">
                  <Image
                    alt={result.name}
                    className="object-contain"
                    fill
                    id="result-image"
                    sizes="300px"
                    src={result.image}
                  />
                </div>
                <div className="text-center text-xs italic text-[#999]" id="image-credit">
                  {result.credit}
                </div>
              </div>
            ) : null}

            <div className="space-y-3" id="dimensions">
              {result.percentages.map((item) => (
                <div className="dim-item flex items-center gap-3 text-sm" key={item.label}>
                  <div className="dim-label min-w-[82px] text-[#666]">{item.label}</div>
                  <div className="h-2 flex-1 overflow-hidden bg-[#efefef]">
                    <div
                      className="h-full bg-[#222]"
                      style={{ width: `${item.score}%` }}
                    />
                  </div>
                  <div className="dim-score min-w-[42px] text-right text-xs text-[#888]">
                    {item.score}%
                  </div>
                </div>
              ))}
            </div>

            <div
              className="rounded-[18px] border-l-[3px] border-[#999] bg-[#f5f5f5] px-4 py-4 text-sm italic leading-7 text-[#666]"
              id="result-note"
            >
              {result.note}
            </div>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button
              className="bg-[#222] px-6 py-3 text-sm font-medium tracking-[0.12em] text-white transition hover:bg-black"
              onClick={() => {
                void openShare();
              }}
              type="button"
            >
              分享结果
            </button>
            <button
              className="border border-[#222] px-6 py-3 text-sm font-medium text-[#222] transition hover:bg-[#222] hover:text-white"
              id="back-btn"
              onClick={handleRestart}
              type="button"
            >
              重 新 作 答
            </button>
          </div>
        </div>

        {isShareOpen ? (
          <div
            aria-labelledby="sdtiShareTitle"
            aria-modal="true"
            className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 p-0 sm:items-center sm:p-4"
            onClick={() => setIsShareOpen(false)}
            role="dialog"
          >
            <div
              className="flex max-h-[88vh] w-full max-w-md flex-col overflow-y-auto rounded-t-[24px] border border-[#ddd] bg-white p-6 shadow-[0_16px_40px_rgba(0,0,0,0.18)] sm:rounded-[24px]"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-[#111]" id="sdtiShareTitle">
                    分享这张结果图
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-[#666]">
                    预览图与真实分享图保持一致。
                  </p>
                </div>
                <button
                  aria-label="Close share dialog"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#ddd] text-[#666]"
                  onClick={() => setIsShareOpen(false)}
                  type="button"
                >
                  ×
                </button>
              </div>

              <div className="mt-5 rounded-[20px] border border-[#e7e7e7] bg-[#fafafa] p-4">
                {shareImageUrl ? (
                  <img
                    alt={`${result.name}分享预览图`}
                    className="mx-auto w-full max-w-sm rounded-[24px] border border-[#ddd] bg-white"
                    src={shareImageUrl}
                  />
                ) : (
                  <div className="mx-auto flex w-full max-w-sm items-center justify-center rounded-[24px] border border-[#ddd] bg-white px-6 py-16 text-sm text-[#666]">
                    正在生成分享图片...
                  </div>
                )}

                <div className="pointer-events-none absolute left-0 top-0 -z-10 opacity-0">
                  <div
                    className="w-[720px] rounded-[24px] bg-[#fafafa] p-6 text-[#111]"
                    ref={shareCardRef}
                    style={{
                      fontFamily:
                        '-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Hiragino Sans GB","Microsoft YaHei",sans-serif',
                    }}
                  >
                    <div className="relative rounded-[22px] border border-[#ddd] bg-white p-6 shadow-[0_16px_40px_rgba(0,0,0,0.08)]">
                      <div className="text-sm font-medium tracking-[0.28em] text-[#555]">
                        SDTI RESULT
                      </div>
                      {result.image ? (
                        <img
                          alt=""
                          src={result.image}
                          style={{
                            border: "1px solid #eee",
                            borderRadius: "12px",
                            display: "block",
                            height: "auto",
                            marginTop: "20px",
                            width: "100%",
                          }}
                        />
                      ) : null}
                      <div
                        style={{
                          background: "#f7f7f7",
                          border: "1px solid #e7e7e7",
                          borderRadius: "18px",
                          marginTop: "20px",
                          padding: "20px",
                        }}
                      >
                        <div
                          style={{
                            fontSize: "42px",
                            fontWeight: 700,
                            lineHeight: 1.2,
                          }}
                        >
                          {result.name}
                        </div>
                        <div
                          style={{
                            color: "#555",
                            fontSize: "24px",
                            lineHeight: 1.8,
                            marginTop: "16px",
                          }}
                        >
                          {shareMeta.summary}
                        </div>
                        <div
                          style={{
                            borderTop: "1px solid #ddd",
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
                className="mt-5 bg-[#222] px-5 py-3 text-sm font-medium text-white"
                onClick={() => {
                  void handleNativeShare();
                }}
                type="button"
              >
                {shareActionLabel}
              </button>

              {shareMessage ? (
                <p className="mt-3 text-sm text-[#222]">{shareMessage}</p>
              ) : null}
            </div>
          </div>
        ) : null}
      </section>
    );
  }

  return (
    <section className="px-4 pb-16 pt-8">
      <div
        className="mx-auto max-w-[760px] rounded-[24px] border border-[#d9d9d9] bg-white px-6 py-8 shadow-[0_20px_48px_rgba(0,0,0,0.06)]"
        id="quiz"
      >
        <header className="border-b border-[#ddd] pb-6 text-center">
          <h1 className="text-[30px] font-semibold tracking-[-0.03em] text-[#111]">
            SDTI人格测试 v2.1
          </h1>
          <p className="mt-2 text-sm text-[#888]">共 32 题 · 一份非常正经的问卷</p>
        </header>

        <div className="mt-6 rounded-[18px] border-l-[3px] border-[#999] bg-[#f0f0f0] px-4 py-4 text-sm leading-7 text-[#555]">
          答案无对错。维度已隐藏，反正不隐藏你也不会认真答。
        </div>

        <div className="mt-8 grid gap-5">
          {sdtiQuestions.map((question) => (
            <SdtiQuestionBlock
              answers={answers}
              key={question.n}
              multiAnswers={multiAnswers}
              onSelectSingle={handleSelectSingle}
              onToggleMulti={handleToggleMulti}
              question={question}
            />
          ))}
        </div>

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
      </div>
    </section>
  );
}
