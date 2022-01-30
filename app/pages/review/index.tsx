import nextCard from "app/cards/queries/nextCard"
import { LinkButton } from "app/components/LinkButton"
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
export default StartReview
