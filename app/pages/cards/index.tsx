import { Suspense, useState } from "react"
import { Head, useRouter, BlitzPage, useMutation, useQuery } from "blitz"
import getCards, { GetCardsResponse } from "app/cards/queries/getCards"
import BannerLayout from "app/core/layouts/BannerLayout"
import { Question } from "app/components/Question"
import { DeleteIcon } from "app/components/icons"
import deleteCard from "app/cards/mutations/deleteCard"
import { MultipleEditableAnswers } from "app/components/MultipleEditableAnswers"
import { CardWithAnswers } from "types"

interface CardRowProps {
  card: CardWithAnswers
  onDelete: () => any
}
const CardRow = (props: CardRowProps) => {
  return (
    <tr className="odd:bg-gray-100 group" key={props.card.id}>
      <td className="px-5">
        <Question card={props.card} editable={true} />
      </td>
      <td className="px-5">
        <MultipleEditableAnswers card={props.card} />
      </td>
      <td className="px-5">{props.card.nextReview ? props.card.nextReview.toDateString() : ""}</td>
      <td className="px-5">
        <button
          onClick={() => props.onDelete()}
          className="text-transparent group-hover:text-gray-400"
        >
          <DeleteIcon />
        </button>
      </td>
    </tr>
  )
}

const PAGE_SIZE = 100

export const CardsList = ({ query }: { query: string }) => {
  const router = useRouter()
  const page = Number(router.query.page) || 1
  const [cardsResult, { setQueryData }] = useQuery(getCards, {
    query,
    limit: PAGE_SIZE,
    offset: (page - 1) * PAGE_SIZE,
  })

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })

  const [deleteMutation] = useMutation(deleteCard)
  const handleDelete = async (cardId: number) => {
    await deleteMutation({ id: cardId })
    setQueryData((oldData: GetCardsResponse) =>
      oldData
        ? {
            values: oldData.values.filter((card: CardWithAnswers) => card.id !== cardId),
            totalCount: oldData.totalCount - 1,
          }
        : { values: [], totalCount: 0 }
    )
  }

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th className="px-5">Question</th>
            <th className="px-5">Answers</th>
            <th className="px-5">Next review on</th>
            <th className="px-5"></th>
          </tr>
        </thead>

        <tbody>
          {cardsResult.values.map((card: CardWithAnswers) => (
            <CardRow
              key={card.id}
              card={card}
              onDelete={() => {
                handleDelete(card.id)
              }}
            />
          ))}
        </tbody>
      </table>
      <button disabled={page === 0} onClick={goToPreviousPage}>
        Previous
      </button>
      <button disabled={cardsResult.totalCount <= PAGE_SIZE * page} onClick={goToNextPage}>
        Next
      </button>
    </div>
  )
}

const CardsPage: BlitzPage = () => {
  // const [deleteMutation] = useMutation(deleteCard)
  const [query, setQuery] = useState("")
  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value)
  }
  return (
    <>
      <Head>
        <title>Cards</title>
      </Head>

      <div>
        <input
          value={query}
          className="border rounded mb-8 px-4 py-2"
          onChange={handleQueryChange}
        />
        <Suspense fallback={<div>Loading...</div>}>
          <CardsList query={query} />
        </Suspense>
      </div>
    </>
  )
}

CardsPage.authenticate = true
CardsPage.getLayout = (page) => <BannerLayout>{page}</BannerLayout>

export default CardsPage
