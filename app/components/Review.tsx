import { Feedback } from "app/components/Feedback"
import { Prompt } from "app/components/Prompt"
import { useEffect, useState } from "react"
import { evaluateAnswer, Evaluation } from "app/logic/evaluateAnswer"
import { CardWithAnswers } from "./CardWithAnswers"
import { getAntiCSRFToken } from "blitz"

export const Review = (props: { card: CardWithAnswers; onNoNextCard: () => any }) => {
  const [card, setCard] = useState(props.card)
  const [shouldShowNext, setShouldShowNext] = useState(false)
  const [nextCard, setNextCard] = useState<CardWithAnswers | null>(null)
  const [givenAnswer, setGivenAnswer] = useState<string | null>(null)
  const [evaluation, setEvaluation] = useState<boolean | null>(null)

  useEffect(() => {
    if (nextCard && shouldShowNext) {
      setCard(nextCard)
      setNextCard(null)
      setShouldShowNext(false)
      setGivenAnswer(null)
      setEvaluation(null)
    }
  }, [nextCard, shouldShowNext])

  const handleNext = async () => {
    setShouldShowNext(true)
  }

  const handlePromptSubmit = async (promptAnswer: string) => {
    const isCorrect = evaluateAnswer(promptAnswer, card.answers)
    const submitAnswerResultPromise = fetch("/api/submitAnswer", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "anti-csrf": getAntiCSRFToken(),
      },
      body: JSON.stringify({ cardId: card.id, isCorrect }),
    })
    setGivenAnswer(promptAnswer)
    setEvaluation(isCorrect)
    const resultJson = await (await submitAnswerResultPromise).json()
    if (!resultJson) {
      props.onNoNextCard()
    } else {
      setNextCard(resultJson)
    }
  }

  if (evaluation !== null) {
    return (
      <Feedback card={card} evaluation={evaluation} givenAnswer={givenAnswer} onNext={handleNext} />
    )
  } else {
    return <Prompt card={card} onSubmit={handlePromptSubmit} />
  }
}
