import { Suspense, useEffect, useState } from "react"
import { Head, Link, usePaginatedQuery, useRouter, BlitzPage, Routes, useMutation } from "blitz"
import getCards from "app/cards/queries/getCards"
import BannerLayout from "app/core/layouts/BannerLayout"
import { Question } from "app/components/Question"
import { Card } from "@prisma/client"
import { CardWithAnswers } from "app/components/CardWithAnswers"
import { DeleteIcon } from "app/components/icons"
import deleteCard from "app/cards/mutations/deleteCard"
import { MultipleEditableAnswers } from "app/components/MultipleEditableAnswers"

const ITEMS_PER_PAGE = 100

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

export const CardsList = () => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const [where, setWhere] = useState({})
  const [{ cards, hasMore }, { setQueryData }] = usePaginatedQuery(getCards, {
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
    where,
  })
  const [deleteMutation] = useMutation(deleteCard)
  const [query, setQuery] = useState("")
  useEffect(() => {
    if (query.length) {
      setWhere({
        OR: [
          {
            question: {
              contains: query,
              mode: "insensitive",
            },
          },
          {
            answers: {
              some: {
                text: {
                  contains: query,
                  mode: "insensitive",
                },
              },
            },
          },
        ],
      })
    } else {
      setWhere({})
    }
  }, [query])

  const goToPreviousPage = () => router.push({ query: { page: page - 1 } })
  const goToNextPage = () => router.push({ query: { page: page + 1 } })
  const handleDelete = async (cardId: number) => {
    await deleteMutation({ id: cardId })
    setQueryData((oldData) =>
      oldData
        ? {
            ...oldData,
            cards: oldData.cards.filter((card: Card) => card.id !== cardId),
          }
        : { cards: [], hasMore: false }
    )
  }
  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value)
  }

  return (
    <div>
      <input value={query} className="border rounded mb-8 px-4 py-2" onChange={handleQueryChange} />
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
          {cards.map((card: CardWithAnswers) => (
            <CardRow key={card.id} card={card} onDelete={() => handleDelete(card.id)} />
          ))}
        </tbody>
      </table>
      <button disabled={page === 0} onClick={goToPreviousPage}>
        Previous
      </button>
      <button disabled={!hasMore} onClick={goToNextPage}>
        Next
      </button>
    </div>
  )
}

const CardsPage: BlitzPage = () => {
  return (
    <>
      <Head>
        <title>Cards</title>
      </Head>

      <div>
        <Suspense fallback={<div>Loading...</div>}>
          <CardsList />
        </Suspense>
      </div>
    </>
  )
}

CardsPage.authenticate = true
CardsPage.getLayout = (page) => <BannerLayout>{page}</BannerLayout>

export default CardsPage
