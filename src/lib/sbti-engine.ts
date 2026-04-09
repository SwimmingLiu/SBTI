import {
  dimensionMeta,
  dimensionOrder,
  drunkTriggerQuestionId,
  normalTypes,
  questions,
  typeLibrary,
} from "@/lib/sbti-data";

export type Answers = Record<string, number>;
export type Level = "L" | "M" | "H";

type RankedType = {
  code: string;
  cn: string;
  desc: string;
  distance: number;
  exact: number;
  intro: string;
  pattern?: string;
  similarity: number;
};

export type SbtiResult = {
  badge: string;
  bestNormal: RankedType;
  finalType: RankedType;
  levels: Record<string, Level>;
  modeKicker: string;
  rawScores: Record<string, number>;
  ranked: RankedType[];
  secondaryType: RankedType | null;
  special: boolean;
  sub: string;
};

export function sumToLevel(score: number) {
  if (score <= 3) {
    return "L";
  }

  if (score === 4) {
    return "M";
  }

  return "H";
}

export function getVisibleQuestions<T extends { id: string }>(
  baseQuestions: T[],
  answers: Record<string, number>,
  followUpQuestion: T,
) {
  const visible = [...baseQuestions];
  const gateIndex = visible.findIndex(
    (question) => question.id === "drink_gate_q1",
  );

  if (gateIndex !== -1 && answers.drink_gate_q1 === 3) {
    visible.splice(gateIndex + 1, 0, followUpQuestion);
  }

  return visible;
}

function levelToNumber(level: Level) {
  return { L: 1, M: 2, H: 3 }[level];
}

function parsePattern(pattern: string) {
  return pattern.replaceAll("-", "").split("") as Level[];
}

function getDrunkTriggered(answers: Answers) {
  return answers[drunkTriggerQuestionId] === 2;
}

export function computeResult(answers: Answers): SbtiResult {
  const rawScores = Object.fromEntries(
    Object.keys(dimensionMeta).map((dimension) => [dimension, 0]),
  ) as Record<string, number>;

  questions.forEach((question) => {
    rawScores[question.dim] += Number(answers[question.id] ?? 0);
  });

  const levels = Object.fromEntries(
    Object.entries(rawScores).map(([dimension, score]) => [
      dimension,
      sumToLevel(score),
    ]),
  ) as Record<string, Level>;

  const userVector = dimensionOrder.map((dimension) =>
    levelToNumber(levels[dimension]),
  );

  const ranked = normalTypes
    .map((type) => {
      const vector = parsePattern(type.pattern).map(levelToNumber);
      let distance = 0;
      let exact = 0;

      for (let index = 0; index < vector.length; index += 1) {
        const diff = Math.abs(userVector[index] - vector[index]);
        distance += diff;
        if (diff === 0) {
          exact += 1;
        }
      }

      const similarity = Math.max(0, Math.round((1 - distance / 30) * 100));

      return {
        ...type,
        ...typeLibrary[type.code],
        distance,
        exact,
        similarity,
      };
    })
    .sort((left, right) => {
      if (left.distance !== right.distance) {
        return left.distance - right.distance;
      }

      if (left.exact !== right.exact) {
        return right.exact - left.exact;
      }

      return right.similarity - left.similarity;
    });

  const bestNormal = ranked[0];

  let finalType: RankedType = bestNormal;
  let modeKicker = "你的主类型";
  let badge = `匹配度 ${bestNormal.similarity}% · 精准命中 ${bestNormal.exact}/15 维`;
  let sub = "维度命中度较高，当前结果可视为你的第一人格画像。";
  let special = false;
  let secondaryType: RankedType | null = null;

  if (getDrunkTriggered(answers)) {
    finalType = {
      ...typeLibrary.DRUNK,
      code: "DRUNK",
      distance: 0,
      exact: 15,
      similarity: 100,
    };
    secondaryType = bestNormal;
    modeKicker = "隐藏人格已激活";
    badge = "匹配度 100% · 酒精异常因子已接管";
    sub = "乙醇亲和性过强，系统已直接跳过常规人格审判。";
    special = true;
  } else if (bestNormal.similarity < 60) {
    finalType = {
      ...typeLibrary.HHHH,
      code: "HHHH",
      distance: bestNormal.distance,
      exact: bestNormal.exact,
      similarity: bestNormal.similarity,
    };
    modeKicker = "系统强制兜底";
    badge = `标准人格库最高匹配仅 ${bestNormal.similarity}%`;
    sub = "标准人格库对你的脑回路集体罢工了，于是系统把你强制分配给了 HHHH。";
    special = true;
  }

  return {
    badge,
    bestNormal,
    finalType,
    levels,
    modeKicker,
    rawScores,
    ranked,
    secondaryType,
    special,
    sub,
  };
}
