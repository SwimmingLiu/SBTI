import { describe, expect, it } from "vitest";

import {
  extractTypeImageMapFromHtml,
  dimensionOrder,
  questions,
} from "@/lib/sbti-data";
import {
  computeResult,
  getVisibleQuestions,
  sumToLevel,
} from "@/lib/sbti-engine";
import { buildResultScenarios } from "@/lib/sbti-scenarios";

describe("sbti data helpers", () => {
  it("extracts type image mappings from original html", () => {
    const map = extractTypeImageMapFromHtml(`
      <script>
        const TYPE_IMAGES = {
          "CTRL": "images/sbti/CTRL.png",
          "DRUNK": "images/sbti/DRUNK.png"
        };
      </script>
    `);

    expect(map).toEqual({
      CTRL: "images/sbti/CTRL.png",
      DRUNK: "images/sbti/DRUNK.png",
    });
  });
});

describe("sbti engine", () => {
  const questionsByDimension = Object.groupBy(questions, (question) => question.dim);

  function buildAnswersForLevels(levels: Array<1 | 2 | 3>) {
    const answers: Record<string, number> = {};

    dimensionOrder.forEach((dimension, index) => {
      const dimensionQuestions = questionsByDimension[dimension];
      const level = levels[index];

      if (!dimensionQuestions || dimensionQuestions.length !== 2) {
        throw new Error(`Unexpected dimension question count for ${dimension}`);
      }

      const pair =
        level === 1 ? [1, 1] : level === 2 ? [2, 2] : [3, 3];

      answers[dimensionQuestions[0].id] = pair[0];
      answers[dimensionQuestions[1].id] = pair[1];
    });

    return answers;
  }

  function buildAnswersForPattern(pattern: string) {
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

  it("maps sum scores to L M H", () => {
    expect(sumToLevel(2)).toBe("L");
    expect(sumToLevel(3)).toBe("L");
    expect(sumToLevel(4)).toBe("M");
    expect(sumToLevel(5)).toBe("H");
    expect(sumToLevel(6)).toBe("H");
  });

  it("shows drink trigger follow-up only when first drink gate answer is 3", () => {
    const baseQuestions = [
      { id: "q1" },
      { id: "drink_gate_q1" },
      { id: "q2" },
    ];
    const followUpQuestion = { id: "drink_gate_q2" };

    expect(
      getVisibleQuestions(baseQuestions, {}, followUpQuestion).map(
        (question) => question.id,
      ),
    ).toEqual(["q1", "drink_gate_q1", "q2"]);

    expect(
      getVisibleQuestions(
        baseQuestions,
        { drink_gate_q1: 2 },
        followUpQuestion,
      ).map((question) => question.id),
    ).toEqual(["q1", "drink_gate_q1", "q2"]);

    expect(
      getVisibleQuestions(
        baseQuestions,
        { drink_gate_q1: 3 },
        followUpQuestion,
      ).map((question) => question.id),
    ).toEqual(["q1", "drink_gate_q1", "drink_gate_q2", "q2"]);
  });

  it("matches a normal type from an exact pattern hit", () => {
    const answers = buildAnswersForPattern("HHH-HMH-MHH-HHH-MHM");

    const result = computeResult(answers);

    expect(result.finalType.code).toBe("CTRL");
    expect(result.special).toBe(false);
    expect(result.bestNormal.similarity).toBe(100);
  });

  it("promotes the DRUNK hidden result when the drink trigger answer is 2", () => {
    const answers = {
      ...buildAnswersForPattern("HHH-HMH-MHH-HHH-MHM"),
      drink_gate_q1: 3,
      drink_gate_q2: 2,
    };

    const result = computeResult(answers);

    expect(result.finalType.code).toBe("DRUNK");
    expect(result.special).toBe(true);
    expect(result.secondaryType?.code).toBe("CTRL");
  });

  it("falls back to HHHH when no normal type reaches 60 similarity", () => {
    const answers = buildAnswersForLevels([1, 2, 2, 3, 1, 1, 1, 3, 3, 2, 3, 1, 3, 1, 2]);

    const result = computeResult(answers);

    expect(result.finalType.code).toBe("HHHH");
    expect(result.special).toBe(true);
    expect(result.bestNormal.similarity).toBeLessThan(60);
  });

  it("builds deterministic scenarios for all reachable results", () => {
    const scenarios = buildResultScenarios();
    const codes = scenarios.map((scenario) => scenario.code);

    expect(new Set(codes).size).toBe(27);
    expect(codes).toContain("CTRL");
    expect(codes).toContain("DRUNK");
    expect(codes).toContain("HHHH");
  });
});
