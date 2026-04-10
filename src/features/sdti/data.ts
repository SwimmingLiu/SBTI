import rawData from "@/features/sdti/data.generated.json";

export type SdtiOption = {
  k: string;
  s?: number;
  t: string;
};

export type SdtiQuestion = {
  dim: string | null;
  longText?: boolean;
  multi?: boolean;
  n: number;
  opts: SdtiOption[];
  text: string;
};

export type SdtiScenario = {
  answers: Record<string, string>;
  code: string;
  hits: number;
  name: string;
  scores: Record<string, number>;
};

type SdtiData = {
  dimensions: Record<string, { label: string; max: number }>;
  questions: SdtiQuestion[];
  scenarios: SdtiScenario[];
};

const data = rawData as SdtiData;

export const sdtiDimensions = data.dimensions;
export const sdtiQuestions = data.questions;
export const sdtiScenarios = data.scenarios;
export const sdtiSingleChoiceCount = sdtiQuestions.filter(
  (question) => !question.multi,
).length;

export function getSdtiScenarioByCode(code: string) {
  return sdtiScenarios.find((scenario) => scenario.code === code) ?? null;
}
