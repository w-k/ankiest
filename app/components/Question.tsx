import updateCard from "app/cards/mutations/updateCard"
import { CardWithAnswers } from "types"
import { useMutation } from "blitz"
import { useEffect, useRef, useState } from "react"

export const Question = (props: { card: CardWithAnswers; editable?: boolean }) => {
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
    if (props.editable) {
      setQuestion(event.target.value)
    }
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
  return (
    <span
      onClick={handleViewModeClick}
      className="border border-transparent hover:border-slate-500 round p-1"
    >
      {question}
    </span>
  )
}
