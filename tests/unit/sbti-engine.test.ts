import { describe, expect, it } from "vitest";

import {
  extractTypeImageMapFromHtml,
} from "@/lib/sbti-data";
import {
  getVisibleQuestions,
  sumToLevel,
} from "@/lib/sbti-engine";

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
});
