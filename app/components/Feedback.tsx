import { Evaluation } from "app/logic/evaluateAnswer"
import { Button } from "./Button"
import { Question } from "./Question"
import { Diff } from "./Diff"
import { ThumbDownIcon, ThumbUpIcon } from "./icons"
import { useKeyUpEffect } from "./useKeyUpEffect"
import { CardWithAnswers } from "./CardWithAnswers"
import { Answer } from "@prisma/client"

export interface FeedbackProps {
  card: CardWithAnswers
  evaluation: Evaluation
  givenAnswer: string
  onNext: () => any
}

export const Feedback = (props: FeedbackProps) => {
  useKeyUpEffect(() => {
    console.log(`[Feedback#useKeyUpEffect]`)
    props.onNext()
  }, "Enter")

  const { isCorrect, otherCorrectAnswers } = props.evaluation
  const hasManyCorrectAnswers = otherCorrectAnswers.length > 0

  return (
    <div className="flex flex-col mr-2 ml-2 items-start">
      <Question text={props.card.question} />
      <div className="ml-auto mr-auto mb-8 flex flex-col h-96 tablet:h-72 laptop:h-48 w-full p-8 tablet:p-4 laptop:p-2 space-y-8 border-t">
        <div>
          {isCorrect ? (
            <div>
              {props.givenAnswer}
              <span className="text-green-500">
                <ThumbUpIcon />
              </span>
            </div>
          ) : !!props.givenAnswer.trim().length ? (
            <Diff given={props.givenAnswer} correct={otherCorrectAnswers} />
          ) : (
            <span className="text-red-500">
              <ThumbDownIcon />
            </span>
          )}
        </div>
        <div>
          {isCorrect && hasManyCorrectAnswers && <div>Also correct:</div>}
          {!isCorrect && hasManyCorrectAnswers && <div>Correct answers:</div>}
          {!isCorrect && !hasManyCorrectAnswers && <div>Correct answer:</div>}
          <ul>
            {otherCorrectAnswers.map((answer: Answer) => (
              <li key={answer.id}>{answer.text}</li>
            ))}
          </ul>
        </div>
      </div>
      <Button primary={true} label="Next" onClick={props.onNext} />
    </div>
  )
}
