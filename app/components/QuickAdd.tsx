import { NewCard } from "app/cards/components/NewCard"
import createCard from "app/cards/mutations/createCard"
import { useMutation } from "blitz"
import { useState } from "react"
import { AddIcon } from "./icons"

const QuickAddModal = (props: { onDeactivate: () => any }) => {
  const [createCardMutation] = useMutation(createCard)
  const handleInnerClick = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation()
  }
  const handleSubmit = async (card: { question: string; answers: string[] }) => {
    createCardMutation(card)
    props.onDeactivate()
  }
  return (
    <div
      className="absolute left-0 right-0 top-0 bottom-0 z-10 backdrop-opacity-20 backdrop-invert"
      onClick={props.onDeactivate}
    >
      <div
        className="bg-white z-20 w-1/3 m-auto mt-40 border rounded shadow p-4"
        onClick={handleInnerClick}
      >
        <NewCard onSubmit={handleSubmit} />
      </div>
    </div>
  )
}

export const QuickAdd = () => {
  const [active, setActive] = useState(false)
  const toggle = () => {
    setActive(!active)
  }
  return (
    <>
      <button onClick={toggle}>
        <AddIcon />
      </button>
      {active && <QuickAddModal onDeactivate={toggle} />}
    </>
  )
}
