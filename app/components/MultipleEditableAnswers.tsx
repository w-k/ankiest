import { Answer } from "types"
import addAnswer from "app/cards/mutations/addAnswer"
import { CardWithAnswers } from "types"
import { useMutation } from "blitz"
import { useEffect, useRef, useState } from "react"
import { AddIcon, ThumbUpIcon } from "./icons"
import { SingleEditableAnswer } from "./SingleEditableAnswer"

export interface MultipleEditableAnswers {
  card: CardWithAnswers
  highlightAnswer?: string | null
}

export const MultipleEditableAnswers = (props: MultipleEditableAnswers) => {
  const [answers, setAnswers] = useState(props.card.answers)

  const [showNewAnswerInput, setShowNewAnswerInput] = useState(false)
  const handleAddAnswer = async () => {
    setShowNewAnswerInput(true)
  }

  const [answerText, setAnswerText] = useState("")
  const textAreaRef = useRef<HTMLTextAreaElement>(null)
  useEffect(() => {
    if (showNewAnswerInput) {
      textAreaRef.current?.focus()
    }
  }, [showNewAnswerInput])
  const [addAnswerMutation] = useMutation(addAnswer)
  const handleAnswerChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAnswerText(event.target.value)
  }
  const handleEditModeBlur = async () => {
    setShowNewAnswerInput(false)
    if (answerText.length) {
      const answer = await addAnswerMutation({
        text: answerText,
        cardId: props.card.id,
      })
      setAnswers([...answers, answer])
    }
    setAnswerText("")
  }
  return (
    <div className="flex justify-between">
      <ul>
        {answers.map((answer: Answer) => {
          const isCorrect =
            props.highlightAnswer && props.highlightAnswer.trim() === answer.text.trim()
          return (
            <li key={answer.id}>
              {isCorrect ? (
                <div className="flex text-green-600">
                  <ThumbUpIcon />
                  <SingleEditableAnswer answer={answer} card={props.card} />
                </div>
              ) : (
                <SingleEditableAnswer answer={answer} card={props.card} />
              )}
            </li>
          )
        })}
        {showNewAnswerInput && (
          <li>
            <textarea
              ref={textAreaRef}
              value={answerText}
              onChange={handleAnswerChange}
              onBlur={handleEditModeBlur}
            />
          </li>
        )}
      </ul>
      {!showNewAnswerInput && (
        <button className="text-transparent group-hover:text-gray-400" onClick={handleAddAnswer}>
          <AddIcon />
        </button>
      )}
    </div>
  )
}
