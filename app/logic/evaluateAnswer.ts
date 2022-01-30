export const evaluateAnswer = (givenAnswer: string, correctAnswers: string[]) => {
  const otherCorrectAnswers = correctAnswers.filter(
    (correctAnswer) => correctAnswer.trim() !== givenAnswer.trim()
  )
  const isCorrect = correctAnswers.length !== otherCorrectAnswers.length
  return {
    isCorrect,
    otherCorrectAnswers,
  }
}
