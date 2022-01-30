import { Ctx, NotFoundError, resolver } from "blitz"
import db from "db"
import { z } from "zod"

const UpdateAnswer = z.object({
  id: z.number(),
  text: z.string(),
})

export default async function updateAnswer(input: z.infer<typeof UpdateAnswer>, ctx: Ctx) {
  const { id, ...data } = input
  ctx.session.$authorize()
  // const card = await db.card.findFirst({
  //   where: {
  //     id: input.cardId,
  //     userId: ctx.session.userId,
  //   },
  // })
  // if (!card) {
  //   throw new NotFoundError()
  // }
  const updateAnswer = await db.answer.update({
    where: { id },
    data,
  })
  return updateAnswer
}
