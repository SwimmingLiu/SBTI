import {
  dimensionExplanations,
  dimensionMeta,
  dimensionOrder,
} from "@/lib/sbti-data";
import type { SbtiResult } from "@/lib/sbti-engine";

type DimensionListProps = {
  result: SbtiResult;
};

export function DimensionList({ result }: DimensionListProps) {
  return (
    <div className="grid gap-3">
      {dimensionOrder.map((dimension) => {
        const level = result.levels[dimension];
        const explanation = dimensionExplanations[dimension][level];

        return (
          <div
            className="rounded-2xl border border-[var(--line)] bg-white px-4 py-3"
            key={dimension}
          >
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <div className="font-semibold text-[var(--foreground)]">
                {dimensionMeta[dimension].name}
              </div>
              <div className="text-sm text-[var(--muted)]">
                {level} / {result.rawScores[dimension]}分
              </div>
            </div>
            <p className="text-sm leading-6 text-[var(--muted)]">{explanation}</p>
          </div>
        );
      })}
    </div>
  );
}
