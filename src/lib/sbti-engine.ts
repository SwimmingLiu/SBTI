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
