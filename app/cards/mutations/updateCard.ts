import { Ctx, NotFoundError, resolver } from "blitz"
import db from "db"
import { z } from "zod"

const UpdateCard = z.object({
  id: z.number(),
  userId: z.number(),
  bucket: z.number(), // TODO: enforce range
  lastReviewed: z.date(),
  nextReview: z.date(),
})

export default async function nextCard(input: z.infer<typeof UpdateCard>, ctx: Ctx) {
  const { id, ...data } = input
  ctx.session.$authorize()
  const card = await db.card.findFirst({
    where: {
      id: input.id,
      userId: ctx.session.userId,
    },
  })
  if (!card) {
    throw new NotFoundError()
  }
  const updatedCard = await db.card.update({
    where: { id },
    data,
  })
  return updatedCard
}
