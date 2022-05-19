import { useEffect, useRef, useState } from "react"
import { CardWithAnswers } from "types"
import { Button } from "./Button"
import { Question } from "./Question"
import { useKeyPressEffect } from "./useKeyDownEffect"

export const Prompt = (props: { card: CardWithAnswers; onSubmit: (answer: string) => any }) => {
  const [givenAnswer, setGivenAnswer] = useState<string>("")
  const answerTextAreaRef = useRef<HTMLTextAreaElement>(null)
  useEffect(() => {
    answerTextAreaRef.current?.focus()
  }, [props.card])

  const handleSubmit = () => {
    console.log(`[Prompt#handleSubmit]`)
    props.onSubmit(givenAnswer)
    setGivenAnswer("")
    if (answerTextAreaRef.current) {
      answerTextAreaRef.current.value = ""
    }
  }
  useKeyPressEffect(handleSubmit, "Enter", answerTextAreaRef)

  const handleGivenAnswerChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setGivenAnswer(event.target.value)
  }

  return (
    <div className="flex flex-col mr-2 ml-2 items-start">
      <div className="ml-auto mr-auto flex h-48 w-full p-8 tablet:p-4 laptop:p-2">
        <div className="self-end">
          <Question card={props.card} />
        </div>
      </div>
      <div className="ml-auto mr-auto flex h-48 w-full  mb-2 ">
        <textarea
          ref={answerTextAreaRef}
          className="ml-auto mr-auto flex w-full border-solid border-2 tablet:border border-gray-600 p-8 tablet:p-4 laptop:p-2 rounded-md"
          value={givenAnswer}
          onChange={handleGivenAnswerChange}
        />
      </div>
      <Button primary={true} label="Submit" onClick={handleSubmit} />
    </div>
  )
}
