import { Answer } from "@prisma/client"

export interface Evaluation {
  isCorrect: boolean
  otherCorrectAnswers: Answer[]
}

export const evaluateAnswer = (givenAnswer: string, correctAnswers: Answer[]): Evaluation => {
  const otherCorrectAnswers = correctAnswers.filter(
    (correctAnswer) => correctAnswer.text.trim() !== givenAnswer.trim()
  )
  const isCorrect = correctAnswers.length !== otherCorrectAnswers.length
  return {
    isCorrect,
    otherCorrectAnswers,
  }
}
