// import { getAntiCSRFToken } from "@blitzjs/auth";
import { Feedback } from "app/components/Feedback"
import { Prompt } from "app/components/Prompt"
import { useEffect, useState } from "react"
import { evaluateAnswer } from "app/logic/evaluateAnswer"
import { NextCardResponse, Stats } from "app/cards/queries/nextCardAndStats"
import { CardWithAnswers } from "types"
import { useMutation } from "@blitzjs/rpc"
import submitAnswer from "app/cards/mutations/submitAnswer"

export interface ReviewProps {
  card: CardWithAnswers
  stats: Stats
  onNoNextCard: () => any
}

const ProgressBar = (props: { fraction: number }) => {
  return (
    <div className="w-full bg-blushPink-50 h-5 rounded">
      <div
        className="h-full bg-blushPink-500 rounded"
        style={{
          width: `${props.fraction * 100}%`,
        }}
      ></div>
    </div>
  )
}

const Progress = (props: { stats: Stats }) => {
  const done = props.stats.reviewedToday
  const total = props.stats.reviewedToday + props.stats.leftToReview
  const completedFraction = done / total
  const percentage = `${Math.round(completedFraction * 100)}%`
  return (
    <div>
      <div>{`Today's progress: ${done}/${total}`}</div>
      <div className="flex">
        <ProgressBar fraction={completedFraction} />
        <div className="w-12 text-right">{percentage}</div>
      </div>
    </div>
  )
}

export const Review = (props: ReviewProps) => {
  const [card, setCard] = useState(props.card)
  const [stats, setStats] = useState(props.stats)
  const [shouldShowNext, setShouldShowNext] = useState(false)
  const [nextCard, setNextCard] = useState<CardWithAnswers | null>(null)
  const [givenAnswer, setGivenAnswer] = useState<string | null>(null)
  const [evaluation, setEvaluation] = useState<boolean | null>(null)
  const [nothingToReview, setNothingToReview] = useState(false)
  const [submitAnswerMutation] = useMutation(submitAnswer)

  useEffect(() => {
    if (shouldShowNext) {
      if (nextCard) {
        setCard(nextCard)
        setNextCard(null)
        setShouldShowNext(false)
        setGivenAnswer(null)
        setEvaluation(null)
      } else if (nothingToReview) {
        props.onNoNextCard()
      }
    }
  }, [nextCard, shouldShowNext, nothingToReview, props])

  const handleNext = async () => {
    setShouldShowNext(true)
  }

  const handlePromptSubmit = async (promptAnswer: string) => {
    const isCorrect = evaluateAnswer(promptAnswer, card.answers)
    const submitAnswerResultPromise = submitAnswerMutation({ cardId: card.id, isCorrect })
    setGivenAnswer(promptAnswer)
    setEvaluation(isCorrect)
    const submitAnswerResult = await submitAnswerResultPromise
    setStats(submitAnswerResult.stats)
    if (!submitAnswerResult.card) {
      setNothingToReview(true)
    } else {
      setNextCard(submitAnswerResult.card)
    }
  }
  return (
    <>
      <Progress stats={stats} />
      {evaluation === null ? (
        <Prompt card={card} onSubmit={handlePromptSubmit} />
      ) : (
        <Feedback
          card={card}
          evaluation={evaluation}
          givenAnswer={givenAnswer}
          onNext={handleNext}
        />
      )}
    </>
  )
}
