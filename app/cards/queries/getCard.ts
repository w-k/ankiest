import { NotFoundError, Ctx } from "blitz"
import db from "db"
import { z } from "zod"

const GetCard = z.object({
  id: z.number().optional().refine(Boolean, "Required"),
})

export default async function getCard(input: z.infer<typeof GetCard>, ctx: Ctx) {
  ctx.session.$authorize()
  const card = await db.card.findFirst({
    where: {
      id: input.id,
      userId: ctx.session.userId,
    },
    include: {
      answers: true,
    },
  })

  if (!card) throw new NotFoundError()

  return card
}
