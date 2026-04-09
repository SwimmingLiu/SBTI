import type { Question } from "@/lib/sbti-data";

type QuestionCardProps = {
  question: Question;
  index: number;
  metaLabel: string;
  selectedValue?: number;
  onChange: (questionId: string, value: number) => void;
};

export function QuestionCard({
  question,
  index,
  metaLabel,
  onChange,
  selectedValue,
}: QuestionCardProps) {
  return (
    <article className="rounded-[18px] border border-[var(--line)] bg-[linear-gradient(180deg,#ffffff,#fbfdfb)] p-5">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3 text-xs text-[var(--muted)]">
        <div className="rounded-full border border-[var(--line)] bg-[var(--soft)] px-3 py-1.5">
          第 {index + 1} 题
        </div>
        <div>{metaLabel}</div>
      </div>
      <h2 className="whitespace-pre-wrap text-base leading-7 text-[var(--foreground)]">
        {question.text}
      </h2>
      <div className="mt-4 grid gap-3">
        {question.options.map((option, optionIndex) => {
          const optionId = `${question.id}-${option.value}`;
          const checked = selectedValue === option.value;
          const optionCode = ["A", "B", "C", "D"][optionIndex] ?? `${optionIndex + 1}`;

          return (
            <label
              className={`flex cursor-pointer items-center gap-3 rounded-2xl border px-4 py-3 transition ${
                checked
                  ? "border-[var(--accent-strong)] bg-[var(--soft)]"
                  : "border-[var(--line)] bg-white hover:border-[var(--accent)]"
              }`}
              htmlFor={optionId}
              key={optionId}
            >
              <input
                checked={checked}
                className="h-4 w-4 accent-[var(--accent-strong)]"
                id={optionId}
                name={question.id}
                onChange={() => onChange(question.id, option.value)}
                type="radio"
                value={option.value}
              />
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--soft)] text-sm font-semibold text-[var(--accent-strong)]">
                {optionCode}
              </span>
              <span className="leading-6 text-[var(--foreground)]">{option.label}</span>
            </label>
          );
        })}
      </div>
    </article>
  );
}
