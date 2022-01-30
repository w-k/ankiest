import { Ctx, NotFoundError } from "blitz"
import db from "db"
import { z } from "zod"

const UpdateCard = z.object({
  id: z.number(),
  question: z.string().optional(),
  userId: z.number().optional(),
  bucket: z.number().optional(), // TODO: enforce range
  lastReviewed: z.date().optional(),
  nextReview: z.date().optional(),
})

export default async function updateCard(input: z.infer<typeof UpdateCard>, ctx: Ctx) {
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
    include: {
      answers: true,
    },
  })
  return updatedCard
}
