import { gSSP } from "app/blitz-server"
import { Routes, BlitzPage } from "@blitzjs/next"
import nextCardAndStats, { NextCardResponse } from "app/cards/queries/nextCardAndStats"
import { CardWithAnswers } from "types"
import { LinkButton } from "app/components/LinkButton"
import { Review } from "app/components/Review"
import BannerLayout from "app/core/layouts/BannerLayout"
import { useState } from "react"
import { Ctx } from "blitz"

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

export const getServerSideProps = gSSP(async ({ ctx }) => {
  const nextCardResult = await nextCardAndStats({}, ctx)
  return {
    props: nextCardResult,
  }
})

ReviewPage.authenticate = true
ReviewPage.suppressFirstRenderFlicker = true
ReviewPage.getLayout = (page) => <BannerLayout title="Review">{page}</BannerLayout>

export default ReviewPage
