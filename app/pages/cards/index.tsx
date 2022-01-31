import { Suspense } from "react"
import { Head, Link, usePaginatedQuery, useRouter, BlitzPage, Routes, useMutation } from "blitz"
import getCards from "app/cards/queries/getCards"
import BannerLayout from "app/core/layouts/BannerLayout"
import { EditableQuestion } from "app/components/EditableQuestion"
import { EditableAnswer } from "app/components/EditableAnswer"
import { Answer, Card } from "@prisma/client"
import { CardWithAnswers } from "app/components/CardWithAnswers"
import { DeleteIcon } from "app/components/icons"
import deleteCard from "app/cards/mutations/deleteCard"

const ITEMS_PER_PAGE = 100

export const CardsList = () => {
  const router = useRouter()
  const page = Number(router.query.page) || 0
  const [{ cards, hasMore }, { setQueryData }] = usePaginatedQuery(getCards, {
    orderBy: { id: "asc" },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  })
  const [deleteMutation] = useMutation(deleteCard)

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

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th className="px-5">Question</th>
            <th className="px-5">Answers</th>
            <th className="px-5">Next review at</th>
            <th className="px-5"></th>
          </tr>
        </thead>

        <tbody>
          {cards.map((card: CardWithAnswers) => (
            <tr className="odd:bg-gray-100" key={card.id}>
              <td className="px-5">
                <EditableQuestion card={card} />
              </td>
              <td className="px-5">
                <ul>
                  {card.answers.map((answer: Answer) => (
                    <li key={answer.id}>
                      <EditableAnswer answer={answer} />
                    </li>
                  ))}
                </ul>
              </td>
              <td className="px-5">{card.nextReview ? card.nextReview.toDateString() : ""}</td>
              <td className="px-5">
                <button onClick={() => handleDelete(card.id)}>
                  <DeleteIcon />
                </button>
              </td>
            </tr>
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
        <p>
          <Link href={Routes.NewCardPage()}>
            <a>Create Card</a>
          </Link>
        </p>

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
