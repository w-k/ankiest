import { Button } from "app/components/Button"
import { CardWithAnswers } from "app/components/CardWithAnswers"
import { DeleteIcon } from "app/components/icons"
import { useKeyUpEffect } from "app/components/useKeyUpEffect"
import { useEffect, useRef, useState } from "react"
import { v4 as uuid } from "uuid"

interface NewCardProps {
  onSubmit: (options: { question: string; answers: string[] }) => any
  card?: CardWithAnswers
}

const Answer = (props: { text: string; onChange: (text: string) => any; onDelete: () => any }) => {
  const [answer, setAnswer] = useState(props.text)
  const answerTextAreaRef = useRef<HTMLTextAreaElement>(null)
  useEffect(() => {
    answerTextAreaRef.current?.focus()
  }, [])
  const handleAnswerChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAnswer(event.target.value)
    props.onChange(event.target.value)
  }
  return (
    <div className="flex">
      <textarea
        ref={answerTextAreaRef}
        className="ml-auto mr-auto mb-2 flex h-96 tablet:h-72 laptop:h-48 w-full border-solid border-2 tablet:border border-gray-600 p-8 tablet:p-4 laptop:p-2"
        value={answer}
        onChange={handleAnswerChange}
      />
      <button onClick={props.onDelete}>
        <DeleteIcon />
      </button>
    </div>
  )
}

const DEFAULT_QUESTION = ""
const DEFAULT_ANSWERS = {}

export const NewCard = (props: NewCardProps) => {
  const [question, setQuestion] = useState<string>(DEFAULT_QUESTION)
  const [answers, setAnswers] = useState<Record<string, string>>(DEFAULT_ANSWERS)
  const handleAddAnswer = () => {
    setAnswers({
      ...answers,
      [uuid()]: "",
    })
  }
  const handleSubmit = async () => {
    await props.onSubmit({
      question,
      answers: Object.values(answers),
    })
    setQuestion(DEFAULT_QUESTION)
    setAnswers(DEFAULT_ANSWERS)
    questionTextAreaRef.current?.focus()
  }
  useKeyUpEffect(handleAddAnswer, "Tab")
  useKeyUpEffect(handleSubmit, "Enter")

  const handleQuestionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuestion(event.target.value)
  }

  const handleAnswerChange = (text: string, key: string) => {
    setAnswers({
      ...answers,
      [key]: text,
    })
  }
  useEffect(() => {
    questionTextAreaRef.current?.focus()
  }, [])

  const handleDelete = (id: string) => {
    delete answers[id]
    setAnswers(answers)
  }

  // const answerTextAreaRef = useRef<HTMLTextAreaElement>(null)
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
        {Object.entries(answers).map(([key, text]) => (
          <div key={key}>
            <Answer
              text={text}
              onChange={(text) => handleAnswerChange(text, key)}
              onDelete={() => handleDelete(key)}
            />
          </div>
        ))}
      </div>
      <div className="flex">
        <Button label="Save" onClick={handleSubmit} primary={true} />
        <Button label="Add Answer" onClick={handleAddAnswer} />
      </div>
    </>
  )
}
