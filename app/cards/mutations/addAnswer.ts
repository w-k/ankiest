import { Ctx, NotFoundError } from "blitz"
import db from "db"
import { z } from "zod"

const AddAnswer = z.object({
  text: z.string(),
  cardId: z.number(),
})

export default async function addAnswer(input: z.infer<typeof AddAnswer>, ctx: Ctx) {
  ctx.session.$authorize()
  // TODO: check that the answer belongs to the user
  const answer = await db.answer.create({
    data: {
      cardId: input.cardId,
      text: input.text,
    },
  })
  return answer
}
