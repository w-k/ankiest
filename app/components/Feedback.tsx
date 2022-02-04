import { Evaluation } from "app/logic/evaluateAnswer"
import { Button } from "./Button"
import { Diff } from "./Diff"
import { useKeyUpEffect } from "./useKeyUpEffect"
import { CardWithAnswers } from "./CardWithAnswers"
import { EditableQuestion } from "./EditableQuestion"
import { MultipleEditableAnswers } from "./MultipleEditableAnswers"

export interface FeedbackProps {
  card: CardWithAnswers
  evaluation: boolean
  givenAnswer: string
  onNext: () => any
}

export const Feedback = (props: FeedbackProps) => {
  useKeyUpEffect(() => {
    console.log(`[Feedback#useKeyUpEffect]`)
    props.onNext()
  }, "Enter")

  return (
    <div className="flex flex-col mr-2 ml-2 items-start">
      <EditableQuestion card={props.card} />
      <div className="ml-auto mr-auto mb-8 flex flex-col h-96 tablet:h-72 laptop:h-48 w-full p-8 tablet:p-4 laptop:p-2 space-y-8 border-t">
        <>
          {!props.evaluation && <Diff given={props.givenAnswer} correct={props.card.answers} />}
          <MultipleEditableAnswers
            card={props.card}
            highlightAnswer={props.evaluation ? props.givenAnswer : undefined}
          />
        </>
      </div>
      <Button primary={true} label="Next" onClick={props.onNext} />
    </div>
  )
}
