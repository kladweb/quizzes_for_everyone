export function calculateQuestionScore(
  selected: string[],
  correct: string[]
): number {
  const hasWrongAnswer = selected.some(id => !correct.includes(id));
  if (hasWrongAnswer) return 0;
  if (selected.length === 0) return 0;
  const correctSelected = selected.filter(id => correct.includes(id)).length;
  return correctSelected / correct.length;
}

export function isQuestionFullyCorrect(score: number): boolean {
  return score === 1;
}

export function calculateTotalScore(
  selectedAnswers: string[][],
  correctAnswersPerQuestion: string[][]
): number {
  return selectedAnswers.reduce((sum, selected, index) => {
    return sum + calculateQuestionScore(selected, correctAnswersPerQuestion[index]);
  }, 0);
}
