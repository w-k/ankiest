import { Answer } from "types"
import { CardWithAnswers } from "types"
import { ThumbUpIcon } from "./icons"
import { SingleAnswer } from "./SingleAnswer"

export interface MultipleAnswersProps {
  card: CardWithAnswers
  highlightAnswer?: string | null
}

export const MultipleAnswers = (props: MultipleAnswersProps) => {
  return (
    <div className="flex justify-between">
      <ul>
        {props.card.answers.map((answer: Answer) => {
          const isCorrect =
            props.highlightAnswer && props.highlightAnswer.trim() === answer.text.trim()
          return (
            <li key={answer.id}>
              {isCorrect ? (
                <div className="flex text-green-600">
                  <ThumbUpIcon />
                  <SingleAnswer answer={answer} />
                </div>
              ) : (
                <SingleAnswer answer={answer} />
              )}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
