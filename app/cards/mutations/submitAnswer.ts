import { Ctx, NotFoundError } from "blitz"
import { z } from "zod"
import getCard from "app/cards/queries/getCard"
import updateCard from "app/cards/mutations/updateCard"
import addDays from "date-fns/addDays"
import nextCardAndStats, { NextCardResponse } from "app/cards/queries/nextCardAndStats"

const bucketDelay = (bucket: number) => {
  if (bucket === 0) {
    return 0
  }
  return Math.pow(2, bucket - 1)
}

const SubmitAnswer = z.object({
  cardId: z.number(),
  isCorrect: z.boolean(),
})

export default async function submitAnswer(
  { cardId, isCorrect }: z.infer<typeof SubmitAnswer>,
  ctx: Ctx
): Promise<NextCardResponse> {
  ctx.session.$authorize()

  const card = await getCard(
    {
      id: cardId,
    },
    ctx
  )
  if (!card) {
    throw new NotFoundError()
  }

  const newBucket = isCorrect ? card.bucket + 1 : 0
  const delay = bucketDelay(newBucket)
  await updateCard(
    {
      id: cardId,
      userId: ctx.session.userId as number,
      bucket: newBucket,
      lastReviewed: new Date(),
      nextReview: addDays(new Date(), delay),
    },
    ctx
  )

  return nextCardAndStats({ avoidCardId: cardId }, ctx)
}
