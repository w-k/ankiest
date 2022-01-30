import { Button } from "app/components/Button"
import { useRef, useState } from "react"
import { Card } from "../queries/getCard"

interface CardFormProps {
  onSubmit: (options: { question: string; answers: string[] }) => any
  card?: Card
}

export function CardForm<CardFormProps>(props) {
  const [question, setQuestion] = useState<string>(props.card?.question ?? "")
  const [answers, setAnswers] = useState<string[]>(props.card?.answers ?? [])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleQuestionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuestion(event.target.value)
  }
  const handleAnswerChange = (event: React.ChangeEvent<HTMLTextAreaElement>, index: number) => {
    setAnswers([...answers.slice(0, index), event.target.value, ...answers.slice(index + 1)])
  }
  const handleSubmit = async () => {
    if (isSubmitting) {
      return
    }
    setIsSubmitting(true)
    const submitPromise = props.onSubmit({ question, answers })
    setQuestion("")
    setAnswers([])
    await submitPromise
    setIsSubmitting(false)
  }

  const handleKeyPress = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter") {
      handleSubmit()
    }
  }

  const handleAddAnswer = () => {
    setAnswers([...answers, ""])
  }

  const handleDelete = (index: number) => {
    setAnswers([...answers.slice(0, index), ...answers.slice(index + 1)])
  }

  const answerTextAreaRef = useRef<HTMLTextAreaElement>(null)
  const questionTextAreaRef = useRef<HTMLTextAreaElement>(null)
  return (
    <>
      <div className="flex flex-col mr-2 ml-2">
        <textarea
          ref={questionTextAreaRef}
          className="ml-auto mr-auto mb-8 flex h-96 tablet:h-72 laptop:h-48 w-full border-solid border-2 tablet:border border-gray-600 p-8 tablet:p-4 laptop:p-2"
          value={question}
          onChange={handleQuestionChange}
        />
        {answers.map((answer, idx) => (
          <>
            <textarea
              key={idx}
              ref={answerTextAreaRef}
              className="ml-auto mr-auto mb-2 flex h-96 tablet:h-72 laptop:h-48 w-full border-solid border-2 tablet:border border-gray-600 p-8 tablet:p-4 laptop:p-2"
              value={answer}
              onChange={(event) => handleAnswerChange(event, idx)}
              onKeyPress={handleKeyPress}
            />
            <Button label="Delete" onClick={() => handleDelete(idx)} />
          </>
        ))}
      </div>
      <Button label="Add Answer" onClick={handleAddAnswer} />
      <Button label="Save" onClick={handleSubmit} />
    </>
  )
}
