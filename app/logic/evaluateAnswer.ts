import { Answer } from "@prisma/client"

export interface Evaluation {
  isCorrect: boolean
  otherCorrectAnswers: Answer[]
}

export const evaluateAnswer = (givenAnswer: string, correctAnswers: Answer[]): boolean => {
  return correctAnswers.some((correctAnswer) => correctAnswer.text.trim() === givenAnswer.trim())
}
