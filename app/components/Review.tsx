import { Feedback } from "app/components/Feedback"
import { Prompt } from "app/components/Prompt"
import { useEffect, useState } from "react"
import { evaluateAnswer, Evaluation } from "app/logic/evaluateAnswer"
import { CardWithAnswers } from "./CardWithAnswers"
import { getAntiCSRFToken } from "blitz"

export const Review = (props: { card: CardWithAnswers }) => {
  const [card, setCard] = useState(props.card)
  const [givenAnswer, setGivenAnswer] = useState<string | null>(null)
  const [evaluation, setEvaluation] = useState<Evaluation | null>(null)

  useEffect(() => {
    if (!givenAnswer) {
      setEvaluation(null)
    } else {
      setEvaluation(evaluateAnswer(givenAnswer, card.answers))
    }
  }, [card, givenAnswer])

  const handleNext = async () => {
    const submitAnswerResult = await fetch("/api/submitAnswer", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "anti-csrf": getAntiCSRFToken(),
      },
      body: JSON.stringify({ cardId: card.id, isCorrect: evaluation?.isCorrect }),
    })
    const resultJson = await submitAnswerResult.json()
    setGivenAnswer(null)
    setEvaluation(null)
    setCard(resultJson)
  }

  const handlePromptSubmit = async (promptAnswer: string) => {
    setGivenAnswer(promptAnswer)
    const shouldShowFeedback = card.answers.length > 1 || !evaluation?.isCorrect
    if (shouldShowFeedback) {
      setGivenAnswer(promptAnswer)
    } else {
      handleNext()
    }
  }

  if (givenAnswer && evaluation) {
    return (
      <Feedback card={card} evaluation={evaluation} givenAnswer={givenAnswer} onNext={handleNext} />
    )
  } else {
    return <Prompt card={card} onSubmit={handlePromptSubmit} />
  }
}
