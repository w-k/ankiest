import { Card } from "@prisma/client"
import updateCard from "app/cards/mutations/updateCard"
import { useMutation } from "blitz"
import { useEffect, useRef, useState } from "react"

export const EditableQuestion = (props: { card: Card }) => {
  const [isEditMode, setEditMode] = useState(false)
  const [question, setQuestion] = useState(props.card.question)
  const [updateCardMutation] = useMutation(updateCard)
  const textAreaRef = useRef<HTMLTextAreaElement>(null)
  useEffect(() => {
    if (isEditMode) {
      textAreaRef.current?.focus()
    }
  }, [isEditMode])

  const handleQuestionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuestion(event.target.value)
  }
  const handleViewModeClick = () => {
    setEditMode(true)
  }
  const handleEditModeBlur = () => {
    setEditMode(false)
    if (question !== props.card.question) {
      updateCardMutation({
        id: props.card.id,
        question,
      })
    }
  }

  if (isEditMode) {
    return (
      <textarea
        ref={textAreaRef}
        value={question}
        onChange={handleQuestionChange}
        onBlur={handleEditModeBlur}
      />
    )
  }
  return <span onClick={handleViewModeClick}>{question}</span>
}
