import { Suspense } from "react"
import { Head, Link, useRouter, useQuery, useParam, BlitzPage, useMutation, Routes } from "blitz"
import Layout from "app/core/layouts/Layout"
import getCard from "app/cards/queries/getCard"
import deleteCard from "app/cards/mutations/deleteCard"

export const Card = () => {
  const router = useRouter()
  const cardId = useParam("cardId", "number")
  const [deleteCardMutation] = useMutation(deleteCard)
  const [card] = useQuery(getCard, { id: cardId })

  return (
    <>
      <Head>
        <title>Card {card.id}</title>
      </Head>

      <div>
        <h1>Card {card.id}</h1>
        <div>{card.question}</div>
        {card.answers.map((answer: string) => (
          <div key={answer}>{answer}</div>
        ))}

        <Link href={Routes.EditCardPage({ cardId: card.id })}>
          <a>Edit</a>
        </Link>

        <button
          type="button"
          onClick={async () => {
            if (window.confirm("This will be deleted")) {
              await deleteCardMutation({ id: card.id })
              router.push(Routes.CardsPage())
            }
          }}
          style={{ marginLeft: "0.5rem" }}
        >
          Delete
        </button>
      </div>
    </>
  )
}

const ShowCardPage: BlitzPage = () => {
  return (
    <div>
      <p>
        <Link href={Routes.CardsPage()}>
          <a>Cards</a>
        </Link>
      </p>

      <Suspense fallback={<div>Loading...</div>}>
        <Card />
      </Suspense>
    </div>
  )
}

ShowCardPage.authenticate = true
ShowCardPage.getLayout = (page) => <Layout>{page}</Layout>

export default ShowCardPage
