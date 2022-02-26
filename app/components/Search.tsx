import getCards from "app/cards/queries/getCards"
import { useQuery } from "blitz"
import { Suspense, useState } from "react"
import { CardWithAnswers } from "./CardWithAnswers"

interface SearchResultsProps {
  query: string
  onDeactivate: () => any
}

const SearchResults = (props: SearchResultsProps) => {
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
  const handleInnerClick = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation()
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
        <div className="flex flex-col text-black z-20 bg-white py-2 px-1 space-y-1 rounded shadow mt-1">
          {cards.map((card: CardWithAnswers) => (
            <div key={card.id}>{card.question}</div>
          ))}
        </div>
      </div>
    </div>
  )
}

const SearchResultsFallback = () => {
  return null
  // return <div className="flex flex-col text-black z-20 bg-white p-1 space-y-1 rounded shadow mt-1">
  //   Loading...
  // </div>
}

export const Search = () => {
  const [query, setQuery] = useState("")
  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value)
  }
  const handleDeactivate = () => {
    setQuery("")
  }
  return (
    <div className="flex flex-col absolute">
      <input className="text-black px-1" onChange={handleQueryChange}></input>
      {query.length ? (
        <Suspense fallback={<SearchResultsFallback />}>
          <SearchResults query={query} onDeactivate={handleDeactivate} />
        </Suspense>
      ) : null}
    </div>
  )
}
