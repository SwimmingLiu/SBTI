"use client";

import { useEffect, useMemo, useRef, useState } from "react";

import { hertiQuestions } from "@/features/herti/data";
import { computeHertiResult, type HertiResult } from "@/features/herti/engine";

type Screen = "cover" | "loading" | "quiz" | "result";

function HtmlBlock({
  className,
  html,
  id,
}: {
  className?: string;
  html: string;
  id?: string;
}) {
  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
      id={id}
    />
  );
}

export function HertiApp() {
  const [screen, setScreen] = useState<Screen>("cover");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Array<number | null>>(
    new Array(hertiQuestions.length).fill(null),
  );
  const [result, setResult] = useState<HertiResult | null>(null);
  const loadingTimerRef = useRef<number | null>(null);
  const currentResult = useMemo(
    () =>
      result ??
      computeHertiResult(
        answers.map((answer) => (answer === null ? 0 : answer)),
      ),
    [answers, result],
  );
  const question = hertiQuestions[currentQuestion];
  const selectedOption = answers[currentQuestion];

  useEffect(() => {
    return () => {
      if (loadingTimerRef.current !== null) {
        window.clearTimeout(loadingTimerRef.current);
      }
    };
  }, []);

  function resetQuiz() {
    if (loadingTimerRef.current !== null) {
      window.clearTimeout(loadingTimerRef.current);
      loadingTimerRef.current = null;
    }

    setAnswers(new Array(hertiQuestions.length).fill(null));
    setCurrentQuestion(0);
    setResult(null);
    setScreen("cover");
    window.scrollTo({ behavior: "smooth", top: 0 });
  }

  function openQuiz() {
    setAnswers(new Array(hertiQuestions.length).fill(null));
    setCurrentQuestion(0);
    setResult(null);
    setScreen("quiz");
    window.scrollTo({ behavior: "smooth", top: 0 });
  }

  function handlePickOption(optionIndex: number) {
    const nextAnswers = answers.slice();
    nextAnswers[currentQuestion] = optionIndex;
    setAnswers(nextAnswers);

    if (currentQuestion === hertiQuestions.length - 1) {
      const computed = computeHertiResult(
        nextAnswers.map((answer) => (answer === null ? 0 : answer)),
      );

      setScreen("loading");
      loadingTimerRef.current = window.setTimeout(() => {
        setResult(computed);
        setScreen("result");
        window.scrollTo({ behavior: "smooth", top: 0 });
      }, 900);
      return;
    }

    setCurrentQuestion((value) => value + 1);
    window.scrollTo({ behavior: "smooth", top: 0 });
  }

  function handleGoBack() {
    if (currentQuestion === 0) {
      return;
    }

    setCurrentQuestion((value) => value - 1);
    window.scrollTo({ behavior: "smooth", top: 0 });
  }

  if (screen === "cover") {
    return (
      <section className="min-h-screen bg-[#f4f1ea] px-4 py-10">
        <div className="mx-auto flex min-h-[720px] max-w-[520px] flex-col justify-between rounded-[28px] bg-[#faf7f0] px-8 py-12 text-center shadow-[0_24px_56px_rgba(56,42,26,0.08)]">
          <div className="mt-8">
            <div className="text-xs uppercase tracking-[0.4em] text-[#7a6f5c]">HERTI</div>
            <div className="mt-2 text-xs italic tracking-[0.16em] text-[#a59886]">
              — a literary personality map —
            </div>
          </div>

          <div>
            <h1 className="text-6xl font-light tracking-[0.08em] text-[#1a1a1a]">
              HERTI
            </h1>
            <div className="mt-3 text-2xl tracking-[0.28em] text-[#2a2620]">
              她 的 人 格 地 图
            </div>
            <div className="mx-auto mt-10 max-w-[320px] text-[15px] leading-8 text-[#4a4338]">
              历史隐藏了她们，
              <br />
              但你的灵魂里，有一块碎片，
              <br />
              正
              <em className="font-serif italic text-[#7a6f5c]">以她的频率震动</em>。
            </div>
            <div className="mt-10 text-sm tracking-[0.5em] text-[#c4b8a0]">· · ·</div>
            <div className="mt-8 text-xs italic tracking-[0.16em] text-[#a59886]">
              16 位女性 · 20 道题 · 约 5 分钟
            </div>
          </div>

          <div>
            <button
              className="bg-[#1a1a1a] px-14 py-4 text-sm tracking-[0.28em] text-[#f4f1ea] transition hover:-translate-y-0.5 hover:bg-[#2a2620]"
              onClick={openQuiz}
              type="button"
            >
              开 始 测 试
            </button>
            <div className="mt-5 text-xs italic tracking-[0.12em] text-[#a59886]">
              请在安静的时刻打开
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (screen === "loading") {
    return (
      <section className="min-h-screen bg-[#f4f1ea] px-4 py-10">
        <div className="mx-auto flex min-h-[720px] max-w-[520px] flex-col items-center justify-center rounded-[28px] bg-[#faf7f0] px-8 py-12 text-center shadow-[0_24px_56px_rgba(56,42,26,0.08)]">
          <div className="text-[20px] italic leading-9 text-[#4a4338]">
            正在为你寻找
            <br />
            与你共振的那一位……
          </div>
          <div className="mt-10 flex gap-3">
            <span className="h-2 w-2 rounded-full bg-[#c4b8a0]" />
            <span className="h-2 w-2 rounded-full bg-[#c4b8a0]" />
            <span className="h-2 w-2 rounded-full bg-[#c4b8a0]" />
          </div>
        </div>
      </section>
    );
  }

  if (screen === "quiz") {
    return (
      <section className="min-h-screen bg-[#f4f1ea] px-4 py-10">
        <div className="mx-auto max-w-[520px] rounded-[28px] bg-[#faf7f0] px-7 py-8 shadow-[0_24px_56px_rgba(56,42,26,0.08)]">
          <div className="flex items-center justify-between text-xs tracking-[0.12em] text-[#8a7d6a]">
            <div id="quizSection">{question.section}</div>
            <div id="quizProgress">
              {String(currentQuestion + 1).padStart(2, "0")} / 20
            </div>
          </div>
          <div className="mt-3 h-px overflow-hidden bg-[#e6dfcd]">
            <div
              className="h-full bg-[#1a1a1a]"
              id="progressFill"
              style={{ width: `${((currentQuestion + 1) / hertiQuestions.length) * 100}%` }}
            />
          </div>

          <div className="mt-9 text-sm italic tracking-[0.12em] text-[#8a7d6a]" id="questionNum">
            Question {String(currentQuestion + 1).padStart(2, "0")}
          </div>
          <h2 className="mt-4 text-2xl leading-9 text-[#1a1a1a]" id="questionText">
            {question.q}
          </h2>

          <div className="mt-8 flex flex-col gap-4" id="options">
            {question.options.map((option, optionIndex) => {
              const selected = selectedOption === optionIndex;

              return (
                <button
                  className={`rounded px-5 py-4 text-left transition ${
                    selected
                      ? "border border-[#8a7d6a] bg-[#e6dfcd]"
                      : "border border-[#e6dfcd] bg-[#f4f0e2] hover:border-[#c4b8a0] hover:bg-[#ede7d8]"
                  }`}
                  data-option-index={optionIndex}
                  data-question-index={currentQuestion}
                  key={`${currentQuestion}-${optionIndex}`}
                  onClick={() => handlePickOption(optionIndex)}
                  type="button"
                >
                  <span className="mr-3 inline-block text-sm italic text-[#8a7d6a]">
                    {String.fromCharCode(65 + optionIndex)}.
                  </span>
                  <span className="text-[15px] leading-7 text-[#2a2620]">
                    {option.t}
                  </span>
                </button>
              );
            })}
          </div>

          <button
            className="mx-auto mt-8 block rounded border border-[#c4b8a0] px-6 py-3 text-xs tracking-[0.2em] text-[#7a6f5c] transition hover:bg-[#ede7d8] hover:text-[#1a1a1a]"
            id="backBtn"
            onClick={handleGoBack}
            style={{ visibility: currentQuestion === 0 ? "hidden" : "visible" }}
            type="button"
          >
            ← 上 一 题
          </button>

          <div className="mt-8 text-center text-xs italic tracking-[0.2em] text-[#c4b8a0]">
            HERTI
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-[#f4f1ea] px-4 py-10">
      <div className="mx-auto max-w-[520px] overflow-hidden rounded-[28px] bg-[#faf7f0] pb-16 shadow-[0_24px_56px_rgba(56,42,26,0.08)]">
        <div className="flex items-center justify-between px-8 pt-6">
          <div className="text-xs tracking-[0.3em] text-[#7a6f5c]">HERTI</div>
          <div className="text-[11px] text-[#a59886]">
            No.{String(Object.keys(hertiQuestions).length).padStart(3, "0")}
          </div>
        </div>

        <div className="px-8 pb-10 pt-12 text-center">
          <div className="text-sm italic tracking-[0.15em] text-[#8a7d6a]">
            你的人格类型是
          </div>
          <div className="mt-3 text-[80px] font-light leading-none tracking-[0.12em] text-[#1a1a1a]" id="hertiPrimaryCode">
            {currentResult.primary.code}
          </div>
          <div className="mt-2 text-sm italic tracking-[0.08em] text-[#a59886]" id="hertiPrimarySource">
            — {currentResult.primary.persona.source}
          </div>
          <div className="mt-6 text-[30px] tracking-[0.08em] text-[#1a1a1a]" id="hertiPrimaryCn">
            {currentResult.primary.persona.cn}
          </div>
          <HtmlBlock
            className="mx-auto mt-8 max-w-[340px] border-y border-[#d9d0bd] px-2 py-6 text-[16px] italic leading-8 text-[#4a4338]"
            html={currentResult.primary.persona.epigraph}
            id="hertiEpigraph"
          />
        </div>

        <div className="px-8">
          <div className="mb-4 flex items-center gap-3 text-xs uppercase tracking-[0.2em] text-[#8a7d6a]">
            <span className="h-px flex-1 bg-[#d9d0bd]" />
            Persona
            <span className="h-px flex-1 bg-[#d9d0bd]" />
          </div>
          <div className="space-y-4 text-[15px] leading-8 text-[#2a2620]" id="hertiPersona">
            {currentResult.primary.persona.persona.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {currentResult.primary.persona.tags.map((tag) => (
              <span
                className="rounded-full border border-[#c4b8a0] px-4 py-1.5 text-sm italic text-[#6a5f4c]"
                key={tag}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="mx-6 mt-10 rounded bg-[#1a1a1a] px-7 py-10 text-[#f4f1ea]">
          <div className="text-center text-[11px] uppercase tracking-[0.24em] text-[#b8a585]">
            Soul Origin · 灵魂原型
          </div>
          <div className="mt-5 text-center text-[28px] tracking-[0.04em]">
            {currentResult.primary.persona.enName}
          </div>
          <div className="mt-2 text-center text-sm tracking-[0.08em] text-[#b8a585]">
            {currentResult.primary.persona.cnName}
          </div>
          <div className="mt-6 space-y-4 text-[14px] leading-8 text-[#d9d0bd]" id="hertiSoul">
            {currentResult.primary.persona.soul.map((paragraph) => (
              <HtmlBlock html={paragraph} key={paragraph} />
            ))}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3 px-8" id="hertiRelations">
          <div className="rounded bg-[#ede7d8] px-4 py-5 text-center">
            <div className="text-[11px] italic tracking-[0.1em] text-[#8a7d6a]">
              your mirror · 镜像
            </div>
            <div className="mt-3 text-[28px] tracking-[0.08em] text-[#1a1a1a]">
              {currentResult.mirror.code}
            </div>
            <div className="mt-2 text-xs text-[#6a5f4c]">
              {currentResult.mirror.persona.cn} · {currentResult.mirror.persona.cnName}
            </div>
          </div>
          <div className="rounded bg-[#ede7d8] px-4 py-5 text-center">
            <div className="text-[11px] italic tracking-[0.1em] text-[#8a7d6a]">
              your opposite · 反面
            </div>
            <div className="mt-3 text-[28px] tracking-[0.08em] text-[#1a1a1a]">
              {currentResult.opposite.code}
            </div>
            <div className="mt-2 text-xs text-[#6a5f4c]">
              {currentResult.opposite.persona.cn} · {currentResult.opposite.persona.cnName}
            </div>
          </div>
        </div>

        <div className="px-8 pt-10 text-center">
          <div className="text-sm tracking-[0.5em] text-[#c4b8a0]">· · ·</div>
          <p className="mt-6 text-[15px] italic leading-8 text-[#8a7d6a]">
            历史隐藏了她们，
            <br />
            但你的灵魂里，有一块碎片，
            <br />
            正以她的频率震动。
          </p>
          <p className="mt-6 rounded bg-[#ede7d8] px-6 py-5 text-[14px] italic leading-8 text-[#6a5f4c]">
            把你的人格卡截图发到小红书，
            <br />
            让她，从你的朋友圈里，
            <br />
            遇见另一个她。
          </p>
          <button
            className="mt-8 bg-[#1a1a1a] px-10 py-4 text-sm tracking-[0.2em] text-[#f4f1ea]"
            onClick={resetQuiz}
            type="button"
          >
            重 新 测 试
          </button>
        </div>
      </div>
    </section>
  );
}
