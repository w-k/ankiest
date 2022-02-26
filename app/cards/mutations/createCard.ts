import { Ctx } from "blitz"
import db from "db"
import { z } from "zod"

const CreateCard = z.object({
  question: z.string(),
  answers: z.array(z.string()),
})

export default async function createCard(input: z.infer<typeof CreateCard>, ctx: Ctx) {
  ctx.session.$authorize()
  const { question, answers } = input
  const card = await db.card.create({
    data: {
      question,
      bucket: 0,
      nextReview: new Date(),
      userId: ctx.session.userId,
      answers: {
        create: answers.map((answer) => ({ text: answer })),
      },
    },
    include: {
      answers: true,
    },
  })

  return card
}
