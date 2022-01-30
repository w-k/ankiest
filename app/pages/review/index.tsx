import nextCard from "app/cards/queries/nextCard"
import { LinkButton } from "app/components/LinkButton"
import BannerLayout from "app/core/layouts/BannerLayout"
import { invokeWithMiddleware, Routes, BlitzPage } from "blitz"

const StartReview: BlitzPage<{ authorizationUrl: string }> = (props) => {
  return (
    <>
      <div>Noting to review.</div>
      <LinkButton label="Home" href={Routes.Home()} />
    </>
  )
}

export async function getServerSideProps(context) {
  const nextCardResult = await invokeWithMiddleware(nextCard, null, context)

  if (!nextCardResult) {
    return { props: {} }
  }
  return {
    props: {},
    redirect: {
      permanent: false,
      destination: `/review/${nextCardResult}`,
    },
  }
}

StartReview.authenticate = true
StartReview.suppressFirstRenderFlicker = true
StartReview.getLayout = (page) => <BannerLayout title="Home">{page}</BannerLayout>

export default StartReview
