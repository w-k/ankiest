import { Ctx } from "blitz"
import { db } from "db"
import { z } from "zod"

const CreateManyCards = z.array(
  z.object({
    question: z.string(),
    answer: z.string(),
  })
)

export default async function createManyCards(input: z.infer<typeof CreateManyCards>, ctx: Ctx) {
  ctx.session.$authorize()

  const cardsResult = await db
    .insertInto("cards")
    .values(
      input.map(({ question }) => ({
        question,
        bucket: 0,
        updatedAt: new Date(),
        lastReviewed: new Date(),
        nextReview: new Date(),
        userId: ctx.session.userId as number,
      }))
    )
    .returning("id")
    .execute()

  await db
    .insertInto("answers")
    .values(
      input.map(({ answer }, index) => ({
        text: answer,
        cardId: cardsResult[index]!.id,
        updatedAt: new Date(),
      }))
    )
    .execute()
}
