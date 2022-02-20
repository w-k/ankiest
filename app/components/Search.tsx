import getCards from "app/cards/queries/getCards"
import { useQuery } from "blitz"
import { Suspense, useState } from "react"
import { CardWithAnswers } from "./CardWithAnswers"

const Results = (props: { query: string }) => {
  const [{ cards }] = useQuery(getCards, {
    orderBy: { id: "asc" },
    take: 10,
    where: {
      OR: [
        {
          question: {
            contains: props.query,
            mode: "insensitive",
          },
        },
        {
          answers: {
            some: {
              text: {
                contains: props.query,
                mode: "insensitive",
              },
            },
          },
        },
      ],
    },
  })
  if (!cards.length) {
    return null
  }
  return (
    <div className="flex flex-col text-black z-20 bg-white py-2 px-1 space-y-1 rounded shadow mt-1">
      {cards.map((card: CardWithAnswers) => (
        <div key={card.id}>{card.question}</div>
      ))}
    </div>
  )
}

export const Search = () => {
  const [query, setQuery] = useState("")
  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value)
  }
  return (
    <div className="flex flex-col absolute">
      <input className="text-black px-1" onChange={handleQueryChange}></input>
      {query.length ? (
        <Suspense fallback={<div>Loading...</div>}>
          <Results query={query} />
        </Suspense>
      ) : null}
    </div>
  )
}
