import { Button } from "app/components/Button"
import { CardWithAnswers } from "app/components/CardWithAnswers"
import { DeleteIcon } from "app/components/icons"
import { useKeyDownEffect, useKeyPressEffect } from "app/components/useKeyDownEffect"
import updateCurrentUser from "app/users/mutations/updateCurrentUser"
import getCurrentUser from "app/users/queries/getCurrentUser"
import { useMutation, useQuery } from "blitz"
import { useEffect, useRef, useState } from "react"
import { v4 as uuid } from "uuid"

interface NewCardProps {
  onSubmit: (options: { question: string; answers: string[] }) => any
  card?: CardWithAnswers
}

interface AnswerProps {
  text: string
  onChange: (text: string) => any
  onDelete: () => any
  onSubmit: () => any
}

const Answer = (props: AnswerProps) => {
  const [answer, setAnswer] = useState(props.text)
  const answerTextAreaRef = useRef<HTMLTextAreaElement>(null)
  useKeyPressEffect(props.onSubmit, "Enter", answerTextAreaRef)
  const handleAnswerChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAnswer(event.target.value)
    props.onChange(event.target.value)
  }
  return (
    <div className="flex group">
      <textarea
        ref={answerTextAreaRef}
        className="ml-auto mr-auto mb-2 flex h-24 w-full border-solid border-2 tablet:border border-gray-600 p-8 tablet:p-4 laptop:p-2"
        value={answer}
        onChange={handleAnswerChange}
      />
      <button onClick={props.onDelete} className="text-gray-300 group-hover:text-gray-600">
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
  const [currentUser] = useQuery(getCurrentUser, { createInverse: true })
  const [updateCurrentUserMutation] = useMutation(updateCurrentUser)
  const [createInverse, setCreateInverse] = useState((currentUser as any).createInverse)
  const handleCreateInverseChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCreateInverse(event.target.checked)
    updateCurrentUserMutation({ createInverse: event.target.checked })
  }
  const handleAddAnswer = () => {
    setAnswers({
      ...answers,
      [uuid()]: "",
    })
  }
  const handleSubmit = async () => {
    const promises = [
      props.onSubmit({
        question,
        answers: Object.values(answers),
      }),
    ]
    if (createInverse) {
      Object.values(answers).forEach((answer: string) => {
        promises.push(
          props.onSubmit({
            question: answer,
            answers: [question],
          })
        )
      })
    }
    await Promise.all(promises)
    setQuestion(DEFAULT_QUESTION)
    setAnswers(DEFAULT_ANSWERS)
    questionTextAreaRef.current?.focus()
  }
  const questionTextAreaRef = useRef<HTMLTextAreaElement>(null)

  useKeyDownEffect(handleAddAnswer, "Tab", questionTextAreaRef)

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
    setAnswers({ ...answers })
  }

  return (
    <>
      <div className="flex flex-col mr-2 ml-2">
        <textarea
          ref={questionTextAreaRef}
          className="ml-auto mr-auto mb-8 flex h-24 w-full border-solid border-2 tablet:border border-gray-600 p-8 tablet:p-4 laptop:p-2"
          value={question}
          onChange={handleQuestionChange}
        />
        {Object.entries(answers).map(([key, text]) => (
          <div key={key}>
            <Answer
              text={text}
              onChange={(text) => handleAnswerChange(text, key)}
              onDelete={() => handleDelete(key)}
              onSubmit={handleSubmit}
            />
          </div>
        ))}
      </div>
      <div className="flex space-x-4 items-baseline">
        <Button label="Save Card" onClick={handleSubmit} primary={true} />
        <Button label="Add Answer" onClick={handleAddAnswer} />
        <div className="flex items-baseline space-x-2">
          <input
            type="checkbox"
            name="createInverse"
            checked={createInverse}
            onChange={handleCreateInverseChange}
          />
          <label htmlFor="createInverse">Create inverse</label>
        </div>
      </div>
    </>
  )
}
