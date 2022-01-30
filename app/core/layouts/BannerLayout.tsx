import { Banner } from "app/components/Banner"
import { Head, BlitzLayout } from "blitz"

const BannerLayout: BlitzLayout<{ title?: string }> = ({ title, children }) => {
  return (
    <>
      <Banner />
      <Head>
        <title>{title || "ankiest"}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="mt-10 w-full tablet:w-2/3 laptop:w-1/2 mx-auto text-lg tablet:text-md laptop:text-sm">
        {children}
      </div>
    </>
  )
}

export default BannerLayout
