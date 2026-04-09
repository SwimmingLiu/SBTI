import { dimensionOrder, normalTypes, questions } from "@/lib/sbti-data";

type ScenarioLevel = 1 | 2 | 3;

export type ResultScenario = {
  answers: Record<string, number>;
  code: string;
  expectedTypeCode: string;
};

const fallbackLevels: ScenarioLevel[] = [1, 2, 2, 3, 1, 1, 1, 3, 3, 2, 3, 1, 3, 1, 2];

const questionsByDimension = questions.reduce<Record<string, typeof questions>>(
  (accumulator, question) => {
    const nextQuestions = accumulator[question.dim] ?? [];
    nextQuestions.push(question);
    accumulator[question.dim] = nextQuestions;
    return accumulator;
  },
  {},
);

export function buildAnswersForLevels(levels: ScenarioLevel[]) {
  const answers: Record<string, number> = {};

  dimensionOrder.forEach((dimension, index) => {
    const dimensionQuestions = questionsByDimension[dimension];
    const level = levels[index];
    const pair = level === 1 ? [1, 1] : level === 2 ? [2, 2] : [3, 3];

    if (!dimensionQuestions || dimensionQuestions.length !== 2) {
      throw new Error(`Unexpected dimension question count for ${dimension}`);
    }

    answers[dimensionQuestions[0].id] = pair[0];
    answers[dimensionQuestions[1].id] = pair[1];
  });

  return answers;
}

export function buildAnswersForPattern(pattern: string) {
  const levels = pattern
    .replaceAll("-", "")
    .split("")
    .map((level) => {
      if (level === "L") return 1 as const;
      if (level === "M") return 2 as const;
      return 3 as const;
    });

  return buildAnswersForLevels(levels);
}

export function buildResultScenarios(): ResultScenario[] {
  const normalScenarios = normalTypes.map((type) => ({
    answers: {
      ...buildAnswersForPattern(type.pattern),
      drink_gate_q1: 2,
    },
    code: type.code,
    expectedTypeCode: type.code,
  }));

  return [
    ...normalScenarios,
    {
      answers: {
        ...buildAnswersForPattern(normalTypes[0].pattern),
        drink_gate_q1: 3,
        drink_gate_q2: 2,
      },
      code: "DRUNK",
      expectedTypeCode: "DRUNK",
    },
    {
      answers: {
        ...buildAnswersForLevels(fallbackLevels),
        drink_gate_q1: 2,
      },
      code: "HHHH",
      expectedTypeCode: "HHHH",
    },
  ];
}
