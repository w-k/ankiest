import { useRouter, useMutation, BlitzPage, Routes } from "blitz"
import createCard from "app/cards/mutations/createCard"
import BannerLayout from "app/core/layouts/BannerLayout"
import { NewCard } from "app/cards/components/NewCard"
import { Suspense } from "react"

const NewCardPage: BlitzPage = () => {
  const router = useRouter()
  const [createCardMutation] = useMutation(createCard)

  return (
    <div>
      <h1>Create New Card</h1>

      <Suspense fallback="Loading...">
        <NewCard
          onSubmit={async (card) => {
            await createCardMutation(card)
            router.push(Routes.NewCardPage())
          }}
        />
      </Suspense>
    </div>
  )
}

NewCardPage.authenticate = true
NewCardPage.getLayout = (page) => <BannerLayout title={"Create New Card"}>{page}</BannerLayout>

export default NewCardPage
