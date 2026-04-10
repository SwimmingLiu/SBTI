"use client";

import { useEffect, useMemo, useState } from "react";

import { QuizScreen } from "@/components/sbti/quiz-screen";
import { ResultScreen } from "@/components/sbti/result-screen";
import { computeResult, getVisibleQuestions } from "@/lib/sbti-engine";
import { questions, specialQuestions, type Question } from "@/lib/sbti-data";

type Screen = "quiz" | "result";

function parseScreenFromSearch(search: string): Screen {
  const screenParam = new URLSearchParams(search).get("screen");

  if (screenParam === "result") {
    return "result";
  }

  return "quiz";
}

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
  const [screen, setScreen] = useState<Screen>("quiz");
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [baseQuestions, setBaseQuestions] = useState<Question[]>([]);

  const visibleQuestions = useMemo(
    () =>
      getVisibleQuestions(baseQuestions, answers, specialQuestions[1] as Question),
    [answers, baseQuestions],
  );

  const doneCount = visibleQuestions.filter(
    (question) => answers[question.id] !== undefined,
  ).length;
  const result = useMemo(() => computeResult(answers), [answers]);
  const hasSessionState = baseQuestions.length > 0;
  const effectiveScreen: Screen = screen === "result" && !hasSessionState ? "quiz" : screen;

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const syncScreenFromRoute = () => {
      setScreen(parseScreenFromSearch(window.location.search));
    };

    syncScreenFromRoute();
    window.addEventListener("popstate", syncScreenFromRoute);

    return () => {
      window.removeEventListener("popstate", syncScreenFromRoute);
    };
  }, []);

  useEffect(() => {
    if (baseQuestions.length > 0) {
      return;
    }

    setBaseQuestions(buildQuizQuestions());
    setAnswers({});
  }, [baseQuestions.length]);

  function updateScreenRoute(nextScreen: Screen, mode: "push" | "replace" = "push") {
    if (typeof window === "undefined") {
      setScreen(nextScreen);
      return;
    }

    const url = new URL(window.location.href);

    if (nextScreen === "quiz") {
      url.searchParams.delete("screen");
    } else {
      url.searchParams.set("screen", "result");
    }

    const method = mode === "replace" ? "replaceState" : "pushState";
    window.history[method]({}, "", url);
    setScreen(nextScreen);
  }

  useEffect(() => {
    if (effectiveScreen !== "result") {
      return;
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [effectiveScreen]);

  function submitQuiz() {
    updateScreenRoute("result");
  }

  function restartQuiz() {
    setAnswers({});
    setBaseQuestions(buildQuizQuestions());
    updateScreenRoute("quiz");
  }

  function goToHome() {
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
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

  if (effectiveScreen === "result") {
    return (
      <ResultScreen
        onRestart={restartQuiz}
        onToTop={goToHome}
        result={result}
      />
    );
  }

  return (
    <QuizScreen
      answers={answers}
      doneCount={doneCount}
      onAnswerChange={handleAnswerChange}
      onBackToIntro={goToHome}
      onSubmit={submitQuiz}
      totalCount={visibleQuestions.length}
      visibleQuestions={visibleQuestions}
    />
  );
}
