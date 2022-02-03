import { Answer } from "@prisma/client"
import updateAnswer from "app/cards/mutations/updateAnswer"
import { useMutation } from "blitz"
import { useEffect, useRef, useState } from "react"

export const EditableAnswer = (props: { answer: Answer }) => {
  const [isEditMode, setEditMode] = useState(false)
  const [answerText, setAnswerText] = useState(props.answer.text)
  const [updateAnswerMutation] = useMutation(updateAnswer)
  const textAreaRef = useRef<HTMLTextAreaElement>(null)
  useEffect(() => {
    if (isEditMode) {
      textAreaRef.current?.focus()
    }
  }, [isEditMode])

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
    <span
      onClick={handleViewModeClick}
      className="border border-transparent hover:border-slate-500 round p-1"
    >
      {answerText}
    </span>
  )
}
