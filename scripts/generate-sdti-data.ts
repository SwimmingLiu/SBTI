import fs from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";

type RawSdtiOption = {
  k: string;
  s?: number;
  t: string;
};

type RawSdtiQuestion = {
  dim: string | null;
  longText?: boolean;
  multi?: boolean;
  n: number;
  opts: RawSdtiOption[];
  text: string;
};

type RawSdtiDimensions = Record<string, { label: string; max: number }>;

type RawSdtiContext = {
  calcType: (scores: Record<string, number>, answers: Record<string, string>) => {
    credit?: string;
    desc: string;
    image?: string;
    name: string;
    note: string;
  };
  dimensions: RawSdtiDimensions;
  questions: RawSdtiQuestion[];
};

type GeneratedScenario = {
  answers: Record<string, string>;
  code: string;
  hits: number;
  name: string;
  scores: Record<string, number>;
};

const resultCodeMap: Record<string, string> = {
  "Feminist · 女权主义者 🔓": "feminist",
  "你说你的型": "you-say-yours",
  "我自己来型": "diy",
  "施工中型": "construction",
  "情绪海绵型": "sponge",
  "笑着崩溃型": "smiling-breakdown",
  "社畜觉醒型": "office-awakening",
  "省电模式型": "power-save",
  "阅人无数型": "human-reader",
};

async function loadSdtiRuntime() {
  const htmlPath = path.join(process.cwd(), "research/sdti/raw/index.html");
  const html = await fs.readFile(htmlPath, "utf8");
  const questionsMatch = html.match(
    /const questions = \[([\s\S]*?)\];\n\nconst dimensions/,
  );
  const dimensionsMatch = html.match(
    /const dimensions = (\{[\s\S]*?\});\n\nfunction calcType/,
  );
  const calcTypeMatch = html.match(
    /function calcType\(s, answers\) \{([\s\S]*?)\n}\n\nconst form/,
  );

  if (!questionsMatch || !dimensionsMatch || !calcTypeMatch) {
    throw new Error("Failed to parse SDTI source blocks.");
  }

  const context = {} as RawSdtiContext;
  vm.createContext(context as unknown as object);
  vm.runInContext(
    `
      questions = [${questionsMatch[1]}];
      dimensions = ${dimensionsMatch[1]};
      function calcType(s, answers) {${calcTypeMatch[1]}}
      this.questions = questions;
      this.dimensions = dimensions;
      this.calcType = calcType;
    `,
    context as unknown as object,
  );

  return context;
}

function isTriggerHit(questionNumber: number, optionKey: string) {
  return (
    (questionNumber === 6 && optionKey === "D") ||
    (questionNumber === 13 && optionKey === "D") ||
    (questionNumber === 29 && optionKey === "D") ||
    (questionNumber === 32 && optionKey === "C")
  );
}

function findScenario(
  runtime: RawSdtiContext,
  targetName: string,
  options: { maxHits?: number; minHits?: number } = {},
) {
  const { questions } = runtime;
  const minHits = options.minHits ?? 0;
  const maxHits = options.maxHits ?? 4;
  const memo = new Set<string>();

  function key(index: number, scores: Record<string, number>, hits: number) {
    return [
      index,
      hits,
      scores.drive,
      scores.stable,
      scores.intimacy,
      scores.guard,
      scores.plan,
      scores.dark,
    ].join("|");
  }

  function dfs(
    index: number,
    scores: Record<string, number>,
    hits: number,
    answers: Record<string, string>,
  ): GeneratedScenario | null {
    if (hits > maxHits) {
      return null;
    }

    if (index === questions.length) {
      if (hits < minHits) {
        return null;
      }

      const result = runtime.calcType(scores, answers);

      if (result.name !== targetName) {
        return null;
      }

      return {
        answers,
        code: resultCodeMap[targetName],
        hits,
        name: result.name,
        scores,
      };
    }

    const memoKey = `${targetName}|${key(index, scores, hits)}`;

    if (memo.has(memoKey)) {
      return null;
    }

    const question = questions[index];

    for (const option of question.opts) {
      const nextScores = { ...scores };

      if (question.dim && typeof option.s === "number") {
        nextScores[question.dim] += option.s;
      }

      const nextHits = hits + (isTriggerHit(question.n, option.k) ? 1 : 0);
      const nextAnswers = {
        ...answers,
        [String(question.n)]: option.k,
      };
      const found = dfs(index + 1, nextScores, nextHits, nextAnswers);

      if (found) {
        return found;
      }
    }

    memo.add(memoKey);
    return null;
  }

  return dfs(
    0,
    {
      dark: 0,
      drive: 0,
      guard: 0,
      intimacy: 0,
      plan: 0,
      stable: 0,
    },
    0,
    {},
  );
}

async function run() {
  const runtime = await loadSdtiRuntime();
  const scenarioTargets = [
    { maxHits: 1, name: "施工中型" },
    { maxHits: 1, name: "笑着崩溃型" },
    { maxHits: 1, name: "省电模式型" },
    { maxHits: 1, name: "阅人无数型" },
    { maxHits: 1, name: "情绪海绵型" },
    { maxHits: 1, name: "社畜觉醒型" },
    { maxHits: 1, name: "你说你的型" },
    { maxHits: 1, name: "我自己来型" },
    { minHits: 2, name: "Feminist · 女权主义者 🔓" },
  ];

  const scenarios = scenarioTargets.map((target) => {
    const scenario = findScenario(runtime, target.name, target);

    if (!scenario) {
      throw new Error(`Unable to find scenario for ${target.name}`);
    }

    return scenario;
  });

  const output = {
    dimensions: runtime.dimensions,
    questions: runtime.questions,
    scenarios,
  };
  const outputPath = path.join(
    process.cwd(),
    "src/features/sdti/data.generated.json",
  );

  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, `${JSON.stringify(output, null, 2)}\n`, "utf8");
  console.log(`Generated ${path.relative(process.cwd(), outputPath)}`);
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
