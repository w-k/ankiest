import { Answer } from "types"

export interface Evaluation {
  isCorrect: boolean
  otherCorrectAnswers: Answer[]
}

export const evaluateAnswer = (givenAnswer: string, correctAnswers: Answer[]): boolean => {
  return correctAnswers.some((correctAnswer) => correctAnswer.text.trim() === givenAnswer.trim())
}
