import { Ctx } from "blitz"
import db from "db"
import { z } from "zod"

const UpdateCurrentUser = z.object({
  createInverse: z.boolean(),
})

export default async function updateCurrentUser(
  input: z.infer<typeof UpdateCurrentUser>,
  ctx: Ctx
) {
  ctx.session.$authorize()
  const updatedUser = await db.user.update({
    where: { id: ctx.session.userId },
    data: input,
  })
  return updatedUser
}
