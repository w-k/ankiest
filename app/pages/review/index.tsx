import nextCard from "app/cards/queries/nextCard"
import { CardWithAnswers } from "app/components/CardWithAnswers"
import { LinkButton } from "app/components/LinkButton"
import { Review } from "app/components/Review"
import BannerLayout from "app/core/layouts/BannerLayout"
import { invokeWithMiddleware, Routes, BlitzPage } from "blitz"

const ReviewPage: BlitzPage<{ card: CardWithAnswers }> = (props) => {
  if (!props.card) {
    return (
      <>
        <div>Noting to review.</div>
        <LinkButton label="Home" href={Routes.Home()} />
      </>
    )
  }
  return <Review card={props.card} />
}

export async function getServerSideProps(context) {
  const nextCardResult = await invokeWithMiddleware(nextCard, null, context)

  return {
    props: {
      card: nextCardResult,
    },
  }
}

ReviewPage.authenticate = true
ReviewPage.suppressFirstRenderFlicker = true
ReviewPage.getLayout = (page) => <BannerLayout title="Home">{page}</BannerLayout>

export default ReviewPage
