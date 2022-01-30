import { Answer } from "@prisma/client"

export const evaluateAnswer = (givenAnswer: string, correctAnswers: Answer[]) => {
  const otherCorrectAnswers = correctAnswers.filter(
    (correctAnswer) => correctAnswer.text.trim() !== givenAnswer.trim()
  )
  const isCorrect = correctAnswers.length !== otherCorrectAnswers.length
  return {
    isCorrect,
    otherCorrectAnswers,
  }
}
