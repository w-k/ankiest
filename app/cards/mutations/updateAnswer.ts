import { Ctx, NotFoundError } from "blitz"
import db from "db"
import { z } from "zod"

const UpdateAnswer = z.object({
  id: z.number(),
  text: z.string(),
})

export default async function updateAnswer(input: z.infer<typeof UpdateAnswer>, ctx: Ctx) {
  const { id, ...data } = input
  ctx.session.$authorize()
  // TODO: check that the answer belongs to the user
  const updateAnswer = await db.answer.update({
    where: { id },
    data,
  })
  return updateAnswer
}
