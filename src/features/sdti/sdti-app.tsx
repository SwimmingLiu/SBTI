"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

import {
  sdtiQuestions,
  sdtiSingleChoiceCount,
  type SdtiQuestion,
} from "@/features/sdti/data";
import { computeSdtiResult } from "@/features/sdti/engine";

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
  const [screen, setScreen] = useState<Screen>("quiz");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [multiAnswers, setMultiAnswers] = useState<Record<string, string[]>>({});
  const result = useMemo(() => computeSdtiResult(answers), [answers]);

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
    window.scrollTo({ behavior: "smooth", top: 0 });
  }

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
              className="border border-[#222] px-6 py-3 text-sm font-medium text-[#222] transition hover:bg-[#222] hover:text-white"
              id="back-btn"
              onClick={handleRestart}
              type="button"
            >
              重 新 作 答
            </button>
          </div>
        </div>
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
          <div className="mt-2 text-xs text-[#999]">@Egeria</div>
        </footer>
      </div>
    </section>
  );
}
