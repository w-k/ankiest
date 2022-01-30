import { Ctx, resolver } from "blitz"
import db from "db"
import { z } from "zod"

const CreateCard = z.object({
  question: z.string(),
  answers: z.array(z.string()),
})

export default async function createCard(input: z.infer<typeof CreateCard>, ctx: Ctx) {
  ctx.session.$authorize()
  const { question } = input
  const answers = JSON.stringify(input.answers)
  const card = await db.card.create({
    data: {
      question,
      answers,
      bucket: 1,
      nextReview: new Date(),
      userId: ctx.session.userId,
    },
  })

  return card
}
