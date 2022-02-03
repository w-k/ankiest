import { Suspense, useEffect, useRef, useState } from "react"
import { Head, Link, usePaginatedQuery, useRouter, BlitzPage, Routes, useMutation } from "blitz"
import getCards from "app/cards/queries/getCards"
import BannerLayout from "app/core/layouts/BannerLayout"
import { EditableQuestion } from "app/components/EditableQuestion"
import { EditableAnswer } from "app/components/EditableAnswer"
import { Answer, Card } from "@prisma/client"
import { CardWithAnswers } from "app/components/CardWithAnswers"
import { AddIcon, DeleteIcon } from "app/components/icons"
import deleteCard from "app/cards/mutations/deleteCard"
import addAnswer from "app/cards/mutations/addAnswer"

const ITEMS_PER_PAGE = 100

interface CardRowProps {
  card: CardWithAnswers
  onDelete: () => any
}
const CardRow = (props: CardRowProps) => {
  const [answers, setAnswers] = useState(props.card.answers)

  const [showNewAnswerInput, setShowNewAnswerInput] = useState(false)
  const handleAddAnswer = async () => {
    setShowNewAnswerInput(true)
  }

  const [answerText, setAnswerText] = useState("")
  const textAreaRef = useRef<HTMLTextAreaElement>(null)
  useEffect(() => {
    if (showNewAnswerInput) {
      textAreaRef.current?.focus()
    }
  }, [showNewAnswerInput])
  const [addAnswerMutation] = useMutation(addAnswer)
  const handleAnswerChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setAnswerText(event.target.value)
  }
  const handleEditModeBlur = async () => {
    setShowNewAnswerInput(false)
    if (answerText.length) {
      const answer = await addAnswerMutation({
        text: answerText,
        cardId: props.card.id,
      })
      setAnswers([...answers, answer])
    }
    setAnswerText("")
  }

  return (
    <tr className="odd:bg-gray-100 group" key={props.card.id}>
      <td className="px-5">
        <EditableQuestion card={props.card} />
      </td>
      <td className="px-5">
        <div className="flex justify-between">
          <ul>
            {answers.map((answer: Answer) => (
              <li key={answer.id}>
                <EditableAnswer answer={answer} />
              </li>
            ))}
            {showNewAnswerInput && (
              <li>
                <textarea
                  ref={textAreaRef}
                  value={answerText}
                  onChange={handleAnswerChange}
                  onBlur={handleEditModeBlur}
                />
              </li>
            )}
          </ul>
          {!showNewAnswerInput && (
            <button
              className="text-transparent group-hover:text-gray-400"
              onClick={handleAddAnswer}
            >
              <AddIcon />
            </button>
          )}
        </div>
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
  const handleAdd = (card) => {}

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
