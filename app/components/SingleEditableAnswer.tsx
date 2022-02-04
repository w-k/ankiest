import { Answer } from "@prisma/client"
import createCard from "app/cards/mutations/createCard"
import updateAnswer from "app/cards/mutations/updateAnswer"
import { useMutation } from "blitz"
import { useEffect, useRef, useState } from "react"
import { CardWithAnswers } from "./CardWithAnswers"
import { SwapIcon } from "./icons"

export const SingleEditableAnswer = (props: { answer: Answer; card: CardWithAnswers }) => {
  const [isEditMode, setEditMode] = useState(false)
  const [answerText, setAnswerText] = useState(props.answer.text)
  const [updateAnswerMutation] = useMutation(updateAnswer)
  const textAreaRef = useRef<HTMLTextAreaElement>(null)
  useEffect(() => {
    if (isEditMode) {
      textAreaRef.current?.focus()
    }
  }, [isEditMode])
  const [createCardMutation] = useMutation(createCard)

  const handleViewModeClick = () => {
    setEditMode(true)
  }
  const handleEditModeBlur = () => {
    setEditMode(false)
    updateAnswerMutation({
      id: props.answer.id,
      text: answerText,
    })
  }

  const handleAnswerChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAnswerText(event.target.value)
  }
  const handleCreateInverse = () => {
    createCardMutation({
      question: props.answer.text,
      answers: [props.card.question],
    })
  }

  if (isEditMode) {
    return (
      <textarea
        ref={textAreaRef}
        value={answerText}
        onChange={handleAnswerChange}
        onBlur={handleEditModeBlur}
      />
    )
  }
  return (
    <div className="flex group">
      <span
        onClick={handleViewModeClick}
        className="border border-transparent hover:border-slate-500 round p-1"
      >
        {answerText}
      </span>
      <button className="text-transparent group-hover:text-gray-400" onClick={handleCreateInverse}>
        <SwapIcon />
      </button>
    </div>
  )
}
