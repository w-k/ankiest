import { Suspense } from "react"
import { Head, Link, useRouter, useQuery, useMutation, useParam, BlitzPage, Routes } from "blitz"
import getCard from "app/cards/queries/getCard"
import updateCard from "app/cards/mutations/updateCard"
import { CardForm } from "app/cards/components/CardForm"
import BannerLayout from "app/core/layouts/BannerLayout"

export const EditCard = () => {
  const router = useRouter()
  const cardId = useParam("cardId", "number")
  const [card, { setQueryData }] = useQuery(
    getCard,
    { id: cardId },
    {
      // This ensures the query never refreshes and overwrites the form data while the user is editing.
      staleTime: Infinity,
    }
  )
  const [updateCardMutation] = useMutation(updateCard)

  return (
    <>
      <Head>
        <title>Edit Card {card.id}</title>
      </Head>

      <div>
        <h1>Edit Card {card.id}</h1>
        <pre>{JSON.stringify(card, null, 2)}</pre>

        <CardForm
          submitText="Update Card"
          // TODO use a zod schema for form validation
          //  - Tip: extract mutation's schema into a shared `validations.ts` file and
          //         then import and use it here
          // schema={UpdateCard}
          initialValues={card}
          onSubmit={async (values) => {
            try {
              const updated = await updateCardMutation({
                id: card.id,
                ...values,
              })
              await setQueryData(updated)
              router.push(Routes.ShowCardPage({ cardId: updated.id }))
            } catch (error: any) {
              console.error(error)
            }
          }}
        />
      </div>
    </>
  )
}

const EditCardPage: BlitzPage = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <EditCard />
      </Suspense>

      <p>
        <Link href={Routes.CardsPage()}>
          <a>Cards</a>
        </Link>
      </p>
    </div>
  )
}

EditCardPage.authenticate = true
EditCardPage.getLayout = (page) => <BannerLayout>{page}</BannerLayout>

export default EditCardPage
