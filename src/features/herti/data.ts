import rawData from "@/features/herti/data.generated.json";

export type HertiPersona = {
  cn: string;
  cnName: string;
  enName: string;
  epigraph: string;
  persona: string[];
  soul: string[];
  source: string;
  tags: string[];
  vec: number[];
};

export type HertiQuestion = {
  options: Array<{ d: number[]; t: string }>;
  q: string;
  section: string;
};

export type HertiScenario = {
  answers: number[];
  code: string;
  mirror: string;
  opposite: string;
  primary: string;
  userNorm: number[];
  userVec: number[];
};

type HertiData = {
  personas: Record<string, HertiPersona>;
  questions: HertiQuestion[];
  scenarios: HertiScenario[];
  sigmaInv: number[][];
};

const data = rawData as HertiData;

export const hertiPersonas = data.personas;
export const hertiQuestions = data.questions;
export const hertiScenarios = data.scenarios;
export const hertiSigmaInv = data.sigmaInv;

export function getHertiScenario(code: string) {
  return hertiScenarios.find((scenario) => scenario.code === code) ?? null;
}
