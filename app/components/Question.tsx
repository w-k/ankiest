import { CardWithAnswers } from "types"

export const Question = (props: { card: CardWithAnswers; editable?: boolean }) => {
  return <span className="border border-transparent round p-1">{props.card.question}</span>
}
