"use client";

import { useEffect, useMemo, useState, useSyncExternalStore } from "react";

import { IntroScreen } from "@/components/sbti/intro-screen";
import { MiniProgramDialog } from "@/components/sbti/mini-program-dialog";
import { QuizScreen } from "@/components/sbti/quiz-screen";
import { ResultScreen } from "@/components/sbti/result-screen";
import {
  fetchMiniProgramUrlLink,
  getMiniProgramConfig,
  isWechatMiniProgram,
  shouldAutoRedirectToMiniProgram,
} from "@/lib/mini-program";
import { computeResult, getVisibleQuestions } from "@/lib/sbti-engine";
import { questions, specialQuestions, type Question } from "@/lib/sbti-data";

type Screen = "intro" | "quiz" | "result";
const SERVER_CLIENT_ENV_SNAPSHOT = JSON.stringify({
  isInMiniProgram: false,
  isMobile: false,
  search: "",
});

function shuffleQuestions(items: Question[]) {
  const nextItems = [...items];

  for (let index = nextItems.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [nextItems[index], nextItems[swapIndex]] = [
      nextItems[swapIndex],
      nextItems[index],
    ];
  }

  return nextItems;
}

function buildQuizQuestions() {
  const shuffledQuestions = shuffleQuestions(questions);
  const insertIndex = Math.floor(Math.random() * shuffledQuestions.length) + 1;

  return [
    ...shuffledQuestions.slice(0, insertIndex),
    specialQuestions[0],
    ...shuffledQuestions.slice(insertIndex),
  ];
}

export function SbtiApp() {
  const miniProgramConfig = useMemo(() => getMiniProgramConfig(), []);
  const [screen, setScreen] = useState<Screen>("intro");
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [baseQuestions, setBaseQuestions] = useState<Question[]>([]);
  const [isMiniProgramDialogOpen, setIsMiniProgramDialogOpen] = useState(false);
  const [isRedirectDismissed, setIsRedirectDismissed] = useState(false);
  const [resolvedMiniProgramUrl, setResolvedMiniProgramUrl] = useState(
    miniProgramConfig.miniProgramUrl,
  );

  const visibleQuestions = useMemo(
    () =>
      getVisibleQuestions(baseQuestions, answers, specialQuestions[1] as Question),
    [answers, baseQuestions],
  );

  const doneCount = visibleQuestions.filter(
    (question) => answers[question.id] !== undefined,
  ).length;
  const result = useMemo(() => computeResult(answers), [answers]);
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
      miniProgramUrl: resolvedMiniProgramUrl,
      search: clientEnv.search,
    });
  }, [clientEnv, isRedirectDismissed, resolvedMiniProgramUrl]);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      const urlLink = await fetchMiniProgramUrlLink();

      if (!cancelled && urlLink) {
        setResolvedMiniProgramUrl(urlLink);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!shouldShowRedirect) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      window.location.href = resolvedMiniProgramUrl;
    }, 1200);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [resolvedMiniProgramUrl, shouldShowRedirect]);

  useEffect(() => {
    if (screen !== "result") {
      return;
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [screen]);

  function startQuiz() {
    setAnswers({});
    setBaseQuestions(buildQuizQuestions());
    setScreen("quiz");
  }

  function handleAnswerChange(questionId: string, value: number) {
    setAnswers((currentAnswers) => {
      const nextAnswers = {
        ...currentAnswers,
        [questionId]: value,
      };

      if (questionId === "drink_gate_q1" && value !== 3) {
        delete nextAnswers.drink_gate_q2;
      }

      return nextAnswers;
    });
  }

  if (shouldShowRedirect) {
    return (
      <section className="w-full">
        <div className="px-4 pb-14 pt-20">
          <div className="mx-auto max-w-xl rounded-[22px] border border-[var(--line)] bg-[var(--panel)] p-10 text-center shadow-[0_16px_40px_rgba(47,73,55,0.08)]">
            <h2 className="text-3xl font-semibold tracking-[-0.03em] text-[var(--foreground)]">
              正在跳转到微信小程序...
            </h2>
            <p className="mt-4 text-base leading-8 text-[var(--muted)]">
              请稍候，即将为你打开 {miniProgramConfig.appName}。
            </p>
            <button
              className="mt-6 rounded-2xl border border-[var(--line)] bg-white px-6 py-3 text-base font-semibold text-[var(--accent-strong)] transition hover:-translate-y-0.5"
              onClick={() => setIsRedirectDismissed(true)}
              type="button"
            >
              取消跳转，继续浏览网页
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (screen === "intro") {
    return (
      <>
        <IntroScreen
          appName={miniProgramConfig.appName}
          onOpenMiniProgram={() => setIsMiniProgramDialogOpen(true)}
          onStart={startQuiz}
        />
        <MiniProgramDialog
          appName={miniProgramConfig.appName}
          isOpen={isMiniProgramDialogOpen}
          miniProgramUrl={resolvedMiniProgramUrl}
          onClose={() => setIsMiniProgramDialogOpen(false)}
          qrCodeUrl={miniProgramConfig.qrCodeUrl}
        />
      </>
    );
  }

  if (screen === "result") {
    return (
      <ResultScreen
        onRestart={startQuiz}
        onToTop={() => setScreen("intro")}
        result={result}
      />
    );
  }

  return (
    <QuizScreen
      answers={answers}
      doneCount={doneCount}
      onAnswerChange={handleAnswerChange}
      onBackToIntro={() => setScreen("intro")}
      onSubmit={() => setScreen("result")}
      totalCount={visibleQuestions.length}
      visibleQuestions={visibleQuestions}
    />
  );
}
