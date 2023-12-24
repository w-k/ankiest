import { Button } from "./Button"
import { Diff } from "./Diff"
import { MultipleAnswers } from "./MultipleAnswers"
import { Question } from "./Question"
import { ThumbDownIcon } from "./icons"
import { useEffect, useRef } from "react"
import { CardWithAnswers } from "types"

export interface FeedbackProps {
  card: CardWithAnswers
  evaluation: boolean
  givenAnswer: string | null
  onNext: () => any
}

export const Feedback = (props: FeedbackProps) => {
  const nextButtonRef = useRef<HTMLButtonElement>(null)
  useEffect(() => {
    nextButtonRef.current?.focus()
  }, [])

  const showCorrection = props.givenAnswer && !props.evaluation

  return (
    <div className="flex flex-col mr-2 ml-2 items-start">
      <div className="ml-auto mr-auto flex h-48 w-full p-8 tablet:p-4 laptop:p-2">
        <div className="self-end">
          <Question card={props.card} editable={true} />
        </div>
      </div>
      <div className="ml-auto mr-auto flex h-48 w-full p-8 tablet:p-4 laptop:p-2 mb-2">
        <div className="flex flex-col">
          {showCorrection ? (
            <Diff given={props.givenAnswer!} correct={props.card.answers} />
          ) : (
            !props.evaluation && (
              <span className="text-red-500">
                <ThumbDownIcon />
              </span>
            )
          )}
          <MultipleAnswers card={props.card} highlightAnswer={props.givenAnswer} />
        </div>
      </div>
      <Button ref={nextButtonRef} primary={true} label="Next" onClick={props.onNext} />
    </div>
  )
}
