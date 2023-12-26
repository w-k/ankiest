import Link from "next/link"
import { BlitzPage, Routes } from "@blitzjs/next"
import BannerLayout from "app/core/layouts/BannerLayout"

const Home: BlitzPage = () => {
  return (
    <div className="relative text-gray-600">
      <div className="flex flex-col items-center">
        <div className="mt-10">
          <h1 className="text-xl tablet:text-lg tracking-wider p-2 mb-16">Ankiest</h1>
          <div className="flex flex-col space-y-2 p-2">
            <Link href={Routes.ReviewPage()}>Start Review</Link>
            <Link href={Routes.NewCardPage()}>Add Card</Link>
            <Link href={Routes.CardsPage()}>Browse</Link>
            <Link href={Routes.ImportPage()}>Import</Link>
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
