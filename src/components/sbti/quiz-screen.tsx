import type { Question } from "@/lib/sbti-data";

import { QuestionCard } from "@/components/sbti/question-card";

type QuizScreenProps = {
  answers: Record<string, number>;
  doneCount: number;
  onAnswerChange: (questionId: string, value: number) => void;
  onBackToIntro: () => void;
  onSubmit: () => void;
  totalCount: number;
  visibleQuestions: Question[];
};

function getQuestionMetaLabel(question: Question) {
  return "special" in question && question.special ? "补充题" : "维度已隐藏";
}

export function QuizScreen({
  answers,
  doneCount,
  onAnswerChange,
  onBackToIntro,
  onSubmit,
  totalCount,
  visibleQuestions,
}: QuizScreenProps) {
  const progress = totalCount === 0 ? 0 : (doneCount / totalCount) * 100;
  const isComplete = totalCount > 0 && doneCount === totalCount;

  return (
    <section className="w-full">
      <div className="px-4 pb-14 pt-6">
        <div className="mx-auto max-w-[980px] rounded-[22px] border border-[var(--line)] bg-[var(--panel)] p-6 shadow-[0_16px_40px_rgba(47,73,55,0.08)] md:p-7">
          <div className="mb-5 flex flex-wrap items-center gap-4">
            <div className="h-2.5 min-w-[240px] flex-1 overflow-hidden rounded-full bg-[#edf3ee]">
              <span
                className="block h-full rounded-full bg-[linear-gradient(90deg,#97b59c,#5b7a62)] transition-[width] duration-200"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="text-sm text-[var(--muted)]">{doneCount} / {totalCount}</div>
          </div>

          <div className="grid gap-4">
            {visibleQuestions.map((question, index) => (
              <QuestionCard
                index={index}
                key={question.id}
                metaLabel={getQuestionMetaLabel(question)}
                onChange={onAnswerChange}
                question={question}
                selectedValue={answers[question.id]}
              />
            ))}
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm leading-6 text-[var(--muted)]">
              {isComplete
                ? "都做完了。现在可以把你的电子魂魄交给结果页审判。"
                : "全选完才会放行。世界已经够乱了，起码把题做完整。"}
            </p>
            <div className="flex flex-wrap gap-3">
              <button
                className="rounded-2xl border border-[var(--line)] bg-white px-5 py-3 font-semibold text-[var(--accent-strong)] transition hover:-translate-y-0.5"
                onClick={onBackToIntro}
                type="button"
              >
                返回首页
              </button>
              <button
                className="rounded-2xl bg-[var(--accent-strong)] px-5 py-3 font-semibold text-white shadow-[0_12px_30px_rgba(77,106,83,0.18)] transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-55 disabled:hover:translate-y-0"
                disabled={!isComplete}
                onClick={onSubmit}
                type="button"
              >
                提交并查看结果
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
