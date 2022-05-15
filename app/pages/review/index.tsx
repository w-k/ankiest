import nextCardAndStats, { NextCardResponse } from "app/cards/queries/nextCardAndStats"
import { CardWithAnswers } from "app/components/CardWithAnswers"
import { LinkButton } from "app/components/LinkButton"
import { Review } from "app/components/Review"
import BannerLayout from "app/core/layouts/BannerLayout"
import { invokeWithMiddleware, Routes, BlitzPage } from "blitz"
import { useState } from "react"

const ReviewPage: BlitzPage<NextCardResponse> = (props) => {
  const [card, setCard] = useState<CardWithAnswers | undefined>(props.card)
  const handleNoNextCard = () => {
    setCard(undefined)
  }
  if (!card) {
    return (
      <>
        <div>Noting to review.</div>
        <LinkButton label="Home" href={Routes.Home()} />
      </>
    )
  }
  return (
    <>
      <Review card={card} stats={props.stats} onNoNextCard={handleNoNextCard} />
    </>
  )
}

export async function getServerSideProps(context) {
  const nextCardResult = await invokeWithMiddleware(nextCardAndStats, {}, context)
  return {
    props: nextCardResult,
  }
}

ReviewPage.authenticate = true
ReviewPage.suppressFirstRenderFlicker = true
ReviewPage.getLayout = (page) => <BannerLayout title="Review">{page}</BannerLayout>

export default ReviewPage
