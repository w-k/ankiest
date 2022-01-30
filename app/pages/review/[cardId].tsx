import { Review } from "app/components/Review"
import BannerLayout from "app/core/layouts/BannerLayout"
import { BlitzPage } from "blitz"
import { Suspense } from "react"

const ReviewPage: BlitzPage<{}> = () => {
  return (
    <Suspense fallback={null}>
      <Review />
    </Suspense>
  )
}

ReviewPage.authenticate = true
ReviewPage.suppressFirstRenderFlicker = true
ReviewPage.getLayout = (page) => <BannerLayout title="Home">{page}</BannerLayout>

export default ReviewPage
