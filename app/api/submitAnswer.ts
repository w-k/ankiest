import updateCard from "app/cards/mutations/updateCard"
import getCard from "app/cards/queries/getCard"
import nextCardAndStats from "app/cards/queries/nextCardAndStats"
import { BlitzApiHandler, getSession, invokeWithMiddleware, NotFoundError } from "blitz"
import addDays from "date-fns/addDays"

type buckets = 1 | 2 | 3 | 4 | 5 | 6

const bucketDelay: Record<buckets, number> = {
  [1]: 0,
  [2]: 1,
  [3]: 2,
  [4]: 4,
  [5]: 9,
  [6]: 14,
}

const handler: BlitzApiHandler = async (req, res) => {
  const session = await getSession(req, res)
  const userId = session.userId as number
  const { cardId, isCorrect } = req.body
  const card = await invokeWithMiddleware(
    getCard,
    {
      id: cardId,
      userId,
    },
    { req, res }
  )
  if (!card) {
    throw new NotFoundError()
  }
  const newBucket = isCorrect ? Math.min(6, card.bucket + 1) : 1
  const delay = bucketDelay[newBucket]
  await invokeWithMiddleware(
    updateCard,
    {
      id: cardId,
      userId,
      bucket: newBucket,
      lastReviewed: new Date(),
      nextReview: addDays(new Date(), delay),
    },
    { req, res }
  )
  const nextCardResult = await invokeWithMiddleware(
    nextCardAndStats,
    { avoidCardId: cardId },
    { req, res }
  )
  res.status(200).json(nextCardResult)
}

export default handler
