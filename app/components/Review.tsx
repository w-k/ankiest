import { useRouter, useQuery, useParam, getAntiCSRFToken } from "blitz"
import getCard from "app/cards/queries/getCard"
import { Feedback } from "app/components/Feedback"
import { Prompt } from "app/components/Prompt"
import { useEffect, useState } from "react"
import { evaluateAnswer } from "app/logic/evaluateAnswer"

export const Review = () => {
  const router = useRouter()
  const cardId = useParam("cardId", "number")
  const [card] = useQuery(getCard, { id: cardId })
  const [givenAnswer, setGivenAnswer] = useState<string | null>(null)
  const [nextCardId, setNextCardId] = useState<string | null>(null)
  const [shouldProceed, setShouldProceed] = useState(false)

  useEffect(() => {
    if (nextCardId && shouldProceed) {
      const nextRoute = `/review/${nextCardId}`
      setShouldProceed(false)
      setGivenAnswer(null)
      setNextCardId(null)
      router.push(nextRoute)
    }
  }, [nextCardId, shouldProceed, router])

  const handleNext = () => {
    setShouldProceed(true)
  }

  const handlePromptSubmit = async (promptAnswer: string) => {
    const { isCorrect } = evaluateAnswer(promptAnswer, card.answers)
    const resultPromise = fetch("/api/submitAnswer", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "anti-csrf": getAntiCSRFToken(),
      },
      body: JSON.stringify({ cardId, isCorrect }),
    })
    const shouldShowFeedback = card.answers.length > 1 || !isCorrect
    if (shouldShowFeedback) {
      setGivenAnswer(promptAnswer)
    } else {
      handleNext()
    }
    const result = await resultPromise
    const resultJson = await result.json()
    setNextCardId(resultJson.nextCardId)
  }

  if (givenAnswer) {
    return <Feedback card={card} givenAnswer={givenAnswer} onNext={handleNext} />
  } else {
    return <Prompt card={card} onSubmit={handlePromptSubmit} />
  }
}
