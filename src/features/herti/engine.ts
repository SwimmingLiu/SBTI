import {
  hertiPersonas,
  hertiQuestions,
  hertiSigmaInv,
  type HertiPersona,
} from "@/features/herti/data";

export type HertiResult = {
  distances: Array<{ code: string; dist: number }>;
  mirror: { code: string; persona: HertiPersona };
  opposite: { code: string; persona: HertiPersona };
  primary: { code: string; persona: HertiPersona };
  userNorm: number[];
  userVec: number[];
};

export function normalizeHertiVector(vec: number[]) {
  const maxAbs = Math.max(...vec.map((value) => Math.abs(value)));

  if (maxAbs === 0) {
    return vec.slice();
  }

  return vec.map((value) => (value * 2) / maxAbs);
}

export function mahalanobisDistance(a: number[], b: number[]) {
  const diff = [a[0] - b[0], a[1] - b[1], a[2] - b[2], a[3] - b[3], a[4] - b[4]];
  let score = 0;

  for (let i = 0; i < 5; i += 1) {
    for (let j = 0; j < 5; j += 1) {
      score += diff[i] * hertiSigmaInv[i][j] * diff[j];
    }
  }

  return Math.sqrt(Math.max(score, 0));
}

export function computeHertiResult(answers: number[]) {
  const userVec = [0, 0, 0, 0, 0];

  for (let index = 0; index < hertiQuestions.length; index += 1) {
    const optionIndex = answers[index];

    if (optionIndex === undefined || optionIndex === null) {
      continue;
    }

    const delta = hertiQuestions[index].options[optionIndex].d;

    for (let dim = 0; dim < 5; dim += 1) {
      userVec[dim] += delta[dim];
    }
  }

  const userNorm = normalizeHertiVector(userVec);
  const distances = Object.keys(hertiPersonas)
    .map((code) => ({
      code,
      dist: mahalanobisDistance(userNorm, hertiPersonas[code].vec),
    }))
    .sort((left, right) => left.dist - right.dist);

  return {
    distances,
    mirror: {
      code: distances[1].code,
      persona: hertiPersonas[distances[1].code],
    },
    opposite: {
      code: distances[distances.length - 1].code,
      persona: hertiPersonas[distances[distances.length - 1].code],
    },
    primary: {
      code: distances[0].code,
      persona: hertiPersonas[distances[0].code],
    },
    userNorm,
    userVec,
  } satisfies HertiResult;
}
