import { BlitzPage, Link, Routes } from "blitz"
import BannerLayout from "app/core/layouts/BannerLayout"

const Home: BlitzPage = () => {
  return (
    <div className="relative text-gray-600">
      <div className="flex flex-col items-center">
        <div className="mt-10">
          <h1 className="text-xl tablet:text-lg tracking-wider p-2 mb-16">Ankiest</h1>
          <div className="flex flex-col space-y-2 p-2">
            <Link href={Routes.ReviewPage()}>
              <a>Start Review</a>
            </Link>
            <Link href={Routes.NewCardPage()}>
              <a>Add Card</a>
            </Link>
            <Link href={Routes.CardsPage()}>
              <a>Browse</a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

Home.authenticate = true
Home.suppressFirstRenderFlicker = true
Home.getLayout = (page) => <BannerLayout title="Home">{page}</BannerLayout>

export default Home
