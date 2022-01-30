import { Card } from "app/cards/queries/getCard"
import { useEffect, useRef, useState } from "react"
import { Button } from "./Button"
import { Question } from "./Question"
import { useKeyUpEffect } from "./useKeyUpEffect"

export const Prompt = (props: { card: Card; onSubmit: (answer: string) => any }) => {
  const [givenAnswer, setGivenAnswer] = useState<string>("")
  const answerTextAreaRef = useRef<HTMLTextAreaElement>(null)
  useEffect(() => {
    answerTextAreaRef.current?.focus()
  }, [props.card])

  const handleSubmit = () => {
    props.onSubmit(givenAnswer)
    setGivenAnswer("")
    if (answerTextAreaRef.current) {
      answerTextAreaRef.current.value = ""
    }
  }
  useKeyUpEffect(handleSubmit, "Enter")

  const handleGivenAnswerChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setGivenAnswer(event.target.value)
  }

  return (
    <div className="flex flex-col mr-2 ml-2 items-start">
      <Question text={props.card.question} />
      <textarea
        ref={answerTextAreaRef}
        className="ml-auto mr-auto mb-2 flex h-96 tablet:h-72 laptop:h-48 w-full border-solid border-2 tablet:border border-gray-600 p-8 tablet:p-4 laptop:p-2 rounded-md"
        value={givenAnswer}
        onChange={handleGivenAnswerChange}
      />
      <Button primary={true} label="Submit" onClick={handleSubmit} />
    </div>
  )
}
