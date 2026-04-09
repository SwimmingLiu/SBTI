"use client";

import { useMemo, useState } from "react";

import { IntroScreen } from "@/components/sbti/intro-screen";
import { QuizScreen } from "@/components/sbti/quiz-screen";
import { getVisibleQuestions } from "@/lib/sbti-engine";
import { questions, specialQuestions, type Question } from "@/lib/sbti-data";

type Screen = "intro" | "quiz";

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
  const [screen, setScreen] = useState<Screen>("intro");
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

  if (screen === "intro") {
    return <IntroScreen onStart={startQuiz} />;
  }

  return (
    <QuizScreen
      answers={answers}
      doneCount={doneCount}
      onAnswerChange={handleAnswerChange}
      onBackToIntro={() => setScreen("intro")}
      onSubmit={() => undefined}
      totalCount={visibleQuestions.length}
      visibleQuestions={visibleQuestions}
    />
  );
}
