import { Answer } from "@prisma/client"
import { Change, diffChars } from "diff"
import { ThumbDownIcon } from "./icons"

export interface DiffComponentProps {
  given: string
  correct: Answer[]
}

const mapChanges = (changes: Change[]) => {
  return changes
    .map((change, index) => {
      if (change.added) {
        return (
          <span key={index} className={`text-red-500`}>
            {change.value}
          </span>
        )
      }
      if (!change.added && !change.removed) {
        return <span key={index}>{change.value}</span>
      }
      return null
    })
    .filter((change) => !!change)
}

export const Diff = (props: DiffComponentProps) => {
  // TODO: display the closest match if there are multiple correct answers
  const charChanges = diffChars(props.correct[0]!.text.trim(), props.given.trim(), {
    ignoreCase: true,
  })
  const limit = 4
  const addedCount = charChanges.reduce((acc, cur) => (cur.added ? acc + (cur.count || 0) : acc), 0)
  const removedCount = charChanges.reduce(
    (acc, cur) => (cur.removed ? acc + (cur.count || 0) : acc),
    0
  )
  if (addedCount < limit && removedCount < limit) {
    return (
      <div>
        {mapChanges(charChanges)}
        <span className="text-red-500">
          <ThumbDownIcon />
        </span>
      </div>
    )
  }
  return (
    <div className="text-red-500">
      {props.given}
      <span className="text-red-500">
        <ThumbDownIcon />
      </span>
    </div>
  )
}
