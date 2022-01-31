import { Ctx, NotFoundError } from "blitz"
import db from "db"
import { z } from "zod"

const DeleteCard = z.object({
  id: z.number(),
})

export default async function deleteCard({ id }: z.infer<typeof DeleteCard>, ctx: Ctx) {
  ctx.session.$authorize()
  const card = await db.card.findFirst({
    where: {
      id,
      userId: ctx.session.userId,
    },
  })
  if (!card) throw new NotFoundError()
  await db.card.update({
    where: { id },
    data: {
      answers: {
        deleteMany: {},
      },
    },
  })
  await db.card.deleteMany({
    where: { id },
  })
}
