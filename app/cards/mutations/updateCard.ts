import { Ctx, NotFoundError } from "blitz"
import { db } from "db"
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
  ctx.session.$authorize()
  const result = await db
    .updateTable("cards")
    .set({
      question: input.question,
      bucket: input.bucket,
      updatedAt: new Date(),
      nextReview: input.nextReview,
      lastReviewed: input.lastReviewed,
    })
    .where("cards.id", "=", input.id)
    .where("cards.userId", "=", ctx.session.userId)
    .executeTakeFirstOrThrow()

  if (result.numUpdatedRows !== BigInt(1)) {
    throw new NotFoundError()
  }
}
