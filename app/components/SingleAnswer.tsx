import { Answer } from "types"

export const SingleAnswer = (props: { answer: Answer }) => {
  return (
    <div className="flex group">
      <span className="border border-transparent round p-1">{props.answer.text}</span>
    </div>
  )
}
