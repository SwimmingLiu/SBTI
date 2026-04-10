import fs from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";

type HertiPersona = {
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

type HertiQuestion = {
  options: Array<{ d: number[]; t: string }>;
  q: string;
  section: string;
};

type HertiRuntime = {
  personas: Record<string, HertiPersona>;
  questions: HertiQuestion[];
  sigmaInv: number[][];
};

type HertiScenario = {
  answers: number[];
  code: string;
  mirror: string;
  opposite: string;
  primary: string;
  userNorm: number[];
  userVec: number[];
};

function createSeededRandom(seed: number) {
  return function nextRandom() {
    let value = seed += 0x6d2b79f5;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

async function loadHertiRuntime() {
  const htmlPath = path.join(process.cwd(), "research/herti/raw/index.html");
  const html = await fs.readFile(htmlPath, "utf8");
  const personasMatch = html.match(
    /const PERSONAS = \{([\s\S]*?)\n};\n\n\/\/ 题目数据/,
  );
  const questionsMatch = html.match(
    /const QUESTIONS = \[([\s\S]*?)\n];\n\n\/\/ ============================================\n\/\/ HERTI · 状态/,
  );
  const sigmaMatch = html.match(/const SIGMA_INV = \[([\s\S]*?)\n];\n\n\/\/ 归一化/);

  if (!personasMatch || !questionsMatch || !sigmaMatch) {
    throw new Error("Failed to parse HERTI source blocks.");
  }

  const context = {} as {
    PERSONAS: Record<string, HertiPersona>;
    QUESTIONS: HertiQuestion[];
    SIGMA_INV: number[][];
  };
  vm.createContext(context as unknown as object);
  vm.runInContext(
    `
      PERSONAS = {${personasMatch[1]}};
      QUESTIONS = [${questionsMatch[1]}];
      SIGMA_INV = [${sigmaMatch[1]}];
      this.PERSONAS = PERSONAS;
      this.QUESTIONS = QUESTIONS;
      this.SIGMA_INV = SIGMA_INV;
    `,
    context as unknown as object,
  );

  return {
    personas: context.PERSONAS,
    questions: context.QUESTIONS,
    sigmaInv: context.SIGMA_INV,
  } satisfies HertiRuntime;
}

function normalize(vec: number[]) {
  const maxAbs = Math.max(...vec.map((value) => Math.abs(value)));

  if (maxAbs === 0) {
    return vec.slice();
  }

  return vec.map((value) => (value * 2) / maxAbs);
}

function mahalanobis(a: number[], b: number[], sigmaInv: number[][]) {
  const diff = [a[0] - b[0], a[1] - b[1], a[2] - b[2], a[3] - b[3], a[4] - b[4]];
  let score = 0;

  for (let i = 0; i < 5; i += 1) {
    for (let j = 0; j < 5; j += 1) {
      score += diff[i] * sigmaInv[i][j] * diff[j];
    }
  }

  return Math.sqrt(Math.max(score, 0));
}

function evaluateAnswers(runtime: HertiRuntime, answers: number[]) {
  const userVec = [0, 0, 0, 0, 0];

  for (let index = 0; index < runtime.questions.length; index += 1) {
    const delta = runtime.questions[index].options[answers[index]].d;

    for (let dim = 0; dim < 5; dim += 1) {
      userVec[dim] += delta[dim];
    }
  }

  const userNorm = normalize(userVec);
  const codes = Object.keys(runtime.personas);
  const distances = codes
    .map((code) => ({
      code,
      dist: mahalanobis(userNorm, runtime.personas[code].vec, runtime.sigmaInv),
    }))
    .sort((left, right) => left.dist - right.dist);

  return {
    distances,
    mirror: distances[1].code,
    opposite: distances[distances.length - 1].code,
    primary: distances[0].code,
    userNorm,
    userVec,
  };
}

function scoreTarget(runtime: HertiRuntime, answers: number[], targetCode: string) {
  const evaluation = evaluateAnswers(runtime, answers);
  const targetDistance = evaluation.distances.find(
    (item) => item.code === targetCode,
  )?.dist;
  const rank = evaluation.distances.findIndex((item) => item.code === targetCode);

  if (targetDistance === undefined || rank === -1) {
    throw new Error(`Missing target code ${targetCode}`);
  }

  return targetDistance + rank * 5;
}

function findScenario(runtime: HertiRuntime, targetCode: string, seed: number) {
  const random = createSeededRandom(seed);
  let bestAnswers: number[] | null = null;
  let bestScore = Number.POSITIVE_INFINITY;
  let bestEvaluation: ReturnType<typeof evaluateAnswers> | null = null;

  for (let restart = 0; restart < 320; restart += 1) {
    const answers = Array.from({ length: runtime.questions.length }, () =>
      Math.floor(random() * 4),
    );
    let improved = true;
    let steps = 0;

    while (improved && steps < 40) {
      improved = false;
      steps += 1;

      for (let questionIndex = 0; questionIndex < answers.length; questionIndex += 1) {
        let localBest = answers[questionIndex];
        let localBestScore = scoreTarget(runtime, answers, targetCode);

        for (let optionIndex = 0; optionIndex < 4; optionIndex += 1) {
          if (optionIndex === answers[questionIndex]) {
            continue;
          }

          const nextAnswers = answers.slice();
          nextAnswers[questionIndex] = optionIndex;
          const candidateScore = scoreTarget(runtime, nextAnswers, targetCode);

          if (candidateScore < localBestScore) {
            localBestScore = candidateScore;
            localBest = optionIndex;
          }
        }

        if (localBest !== answers[questionIndex]) {
          answers[questionIndex] = localBest;
          improved = true;
        }
      }
    }

    const evaluation = evaluateAnswers(runtime, answers);
    const finalScore = scoreTarget(runtime, answers, targetCode);

    if (finalScore < bestScore) {
      bestAnswers = answers.slice();
      bestEvaluation = evaluation;
      bestScore = finalScore;
    }

    if (evaluation.primary === targetCode) {
      return {
        answers,
        code: targetCode,
        mirror: evaluation.mirror,
        opposite: evaluation.opposite,
        primary: evaluation.primary,
        userNorm: evaluation.userNorm,
        userVec: evaluation.userVec,
      } satisfies HertiScenario;
    }
  }

  if (!bestAnswers || !bestEvaluation) {
    throw new Error(`Failed to seed search for ${targetCode}`);
  }

  throw new Error(
    `Unable to find scenario for ${targetCode}; best primary was ${bestEvaluation.primary} with score ${bestScore.toFixed(4)}`,
  );
}

async function run() {
  const runtime = await loadHertiRuntime();
  const personaCodes = Object.keys(runtime.personas);
  const scenarios = personaCodes.map((code, index) =>
    findScenario(runtime, code, 20260410 + index),
  );
  const outputPath = path.join(
    process.cwd(),
    "src/features/herti/data.generated.json",
  );

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(
    outputPath,
    `${JSON.stringify(
      {
        personas: runtime.personas,
        questions: runtime.questions,
        scenarios,
        sigmaInv: runtime.sigmaInv,
      },
      null,
      2,
    )}\n`,
    "utf8",
  );
  console.log(`Generated ${path.relative(process.cwd(), outputPath)}`);
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
