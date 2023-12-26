import { Ctx } from "blitz"
import { db } from "db"
import { z } from "zod"

const CreateCard = z.object({
  question: z.string(),
  answers: z.array(z.string()),
})

export default async function createCard(input: z.infer<typeof CreateCard>, ctx: Ctx) {
  ctx.session.$authorize()
  const { question, answers } = input
  const cardResult = await db
    .insertInto("cards")
    .values({
      question,
      bucket: 0,
      updatedAt: new Date(),
      lastReviewed: new Date(),
      nextReview: new Date(),
      userId: ctx.session.userId as number,
    })
    .returning("id")
    .executeTakeFirstOrThrow()

  await db
    .insertInto("answers")
    .values(
      answers.map((answer) => ({
        text: answer,
        cardId: cardResult.id,
        updatedAt: new Date(),
      }))
    )
    .execute()
}
