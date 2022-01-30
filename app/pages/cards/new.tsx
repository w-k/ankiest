import { Link, useRouter, useMutation, BlitzPage, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import createCard from "app/cards/mutations/createCard"
import { CardForm } from "app/cards/components/CardForm"

const NewCardPage: BlitzPage = () => {
  const router = useRouter()
  const [createCardMutation] = useMutation(createCard)

  return (
    <div>
      <h1>Create New Card</h1>

      <CardForm
        onSubmit={async (values) => {
          try {
            const card = await createCardMutation(values)
            router.push(Routes.ShowCardPage({ cardId: card.id }))
          } catch (error: any) {
            console.error(error)
          }
        }}
      />

      <p>
        <Link href={Routes.CardsPage()}>
          <a>Cards</a>
        </Link>
      </p>
    </div>
  )
}

NewCardPage.authenticate = true
NewCardPage.getLayout = (page) => <Layout title={"Create New Card"}>{page}</Layout>

export default NewCardPage
