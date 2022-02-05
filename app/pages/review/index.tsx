import nextCard from "app/cards/queries/nextCard"
import { CardWithAnswers } from "app/components/CardWithAnswers"
import { LinkButton } from "app/components/LinkButton"
import { Review } from "app/components/Review"
import BannerLayout from "app/core/layouts/BannerLayout"
import { invokeWithMiddleware, Routes, BlitzPage } from "blitz"
import { useState } from "react"

interface ReviewPageProps {
  card: CardWithAnswers | null
}

const ReviewPage: BlitzPage<ReviewPageProps> = (props) => {
  const [card, setCard] = useState<CardWithAnswers | null>(props.card)
  const handleNoNextCard = () => {
    setCard(null)
  }
  if (!card) {
    return (
      <>
        <div>Noting to review.</div>
        <LinkButton label="Home" href={Routes.Home()} />
      </>
    )
  }
  return <Review card={card} onNoNextCard={handleNoNextCard} />
}

export async function getServerSideProps(context) {
  const nextCardResult = await invokeWithMiddleware(nextCard, {}, context)
  return {
    props: {
      card: nextCardResult.card,
    },
  }
}

ReviewPage.authenticate = true
ReviewPage.suppressFirstRenderFlicker = true
ReviewPage.getLayout = (page) => <BannerLayout title="Home">{page}</BannerLayout>

export default ReviewPage
