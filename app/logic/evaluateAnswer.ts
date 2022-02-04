import { Answer } from "@prisma/client"

export interface Evaluation {
  isCorrect: boolean
  otherCorrectAnswers: Answer[]
}

export const evaluateAnswer = (givenAnswer: string, correctAnswers: Answer[]): boolean => {
  const otherCorrectAnswers = correctAnswers.filter(
    (correctAnswer) => correctAnswer.text.trim() !== givenAnswer.trim()
  )
  return correctAnswers.length !== otherCorrectAnswers.length
}
