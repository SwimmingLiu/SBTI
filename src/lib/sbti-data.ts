import rawData from "./sbti-data.generated.json";
import { toAssetUrl } from "@/lib/asset-urls";

export type AnswerValue = number;

export type QuestionOption = {
  label: string;
  value: AnswerValue;
};

export type DimensionMeta = {
  name: string;
  model: string;
};

export type RegularQuestion = {
  id: string;
  dim: string;
  text: string;
  options: QuestionOption[];
};

export type SpecialQuestion = {
  id: string;
  special: true;
  kind: string;
  text: string;
  options: QuestionOption[];
};

export type Question = RegularQuestion | SpecialQuestion;

export type TypeProfile = {
  code: string;
  cn: string;
  intro: string;
  desc: string;
};

export type TypePattern = {
  code: string;
  pattern: string;
};

export type DimensionExplanation = Record<string, Record<string, string>>;

type RawSbtiData = {
  dimensionMeta: Record<string, DimensionMeta>;
  questions: RegularQuestion[];
  specialQuestions: SpecialQuestion[];
  TYPE_LIBRARY: Record<string, TypeProfile>;
  TYPE_IMAGES: Record<string, string>;
  NORMAL_TYPES: TypePattern[];
  DIM_EXPLANATIONS: DimensionExplanation;
  dimensionOrder: string[];
  DRUNK_TRIGGER_QUESTION_ID: string;
};

const data = rawData as RawSbtiData;

export function extractTypeImageMapFromHtml(html: string) {
  const match = html.match(/const\s+TYPE_IMAGES\s*=\s*(\{[\s\S]*?\});/);

  if (!match) {
    return {};
  }

  return JSON.parse(match[1]) as Record<string, string>;
}

function toSbtiImageUrl(relativePath: string) {
  return toAssetUrl(`original/sbti/${relativePath.split("/").pop()}`);
}

export const dimensionMeta = data.dimensionMeta;
export const questions = data.questions;
export const specialQuestions = data.specialQuestions;
export const typeLibrary = data.TYPE_LIBRARY;
export const typeImages = Object.fromEntries(
  Object.entries(data.TYPE_IMAGES).map(([code, relativePath]) => [
    code,
    toSbtiImageUrl(relativePath),
  ]),
) as Record<string, string>;
export const normalTypes = data.NORMAL_TYPES;
export const dimensionExplanations = data.DIM_EXPLANATIONS;
export const dimensionOrder = data.dimensionOrder;
export const drunkTriggerQuestionId = data.DRUNK_TRIGGER_QUESTION_ID;
