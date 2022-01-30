import { Review } from "app/components/Review"
import { BlitzPage } from "blitz"
import { Suspense } from "react"

const ReviewPage: BlitzPage<{}> = () => {
  return (
    <Suspense fallback={null}>
      <Review />
    </Suspense>
  )
}

export default ReviewPage
