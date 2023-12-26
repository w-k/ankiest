import { useMutation } from "@blitzjs/rpc"
import { NewCard } from "app/cards/components/NewCard"
import createCard from "app/cards/mutations/createCard"
import { Suspense } from "react"

export const EditModal = (props: { onDeactivate: () => any }) => {
  const [createCardMutation] = useMutation(createCard)
  const handleInnerClick = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation()
  }
  const handleSubmit = async (card: { question: string; answers: string[] }) => {
    await createCardMutation(card)
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
        <Suspense fallback="Loading...">
          <NewCard onSubmit={handleSubmit} />
        </Suspense>
      </div>
    </div>
  )
}
