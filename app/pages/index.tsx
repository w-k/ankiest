import { BlitzPage, Routes } from "blitz"
import { LinkButton } from "app/components/LinkButton"
import Layout from "app/core/layouts/Layout"

const Home: BlitzPage = () => {
  return (
    <div className="relative text-gray-600">
      <div className="flex flex-col items-center">
        <div className="mt-10">
          <h1 className="text-xl tablet:text-lg tracking-wider p-2 mb-16">Ankiest</h1>
          <div className="flex flex-col space-y-2 p-2">
            <LinkButton label="Start review" href={Routes.StartReview()} />
            <LinkButton label="Add card" href={Routes.NewCardPage()} />
            <LinkButton label="Browse" href={Routes.CardsPage()} />
            <LinkButton label="Import" href={Routes.Home()} />
          </div>
        </div>
      </div>
    </div>
  )
}

Home.authenticate = true
Home.suppressFirstRenderFlicker = true
Home.getLayout = (page) => <Layout title="Home">{page}</Layout>

export default Home
