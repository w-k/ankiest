import { Card as DbCard } from "@prisma/client"
import { NotFoundError, Ctx } from "blitz"
import db from "db"
import { z } from "zod"

const GetCard = z.object({
  id: z.number().optional().refine(Boolean, "Required"),
})

export type Card = Omit<DbCard, "answers"> & { answers: string[] }

export default async function nextCard(input: z.infer<typeof GetCard>, ctx: Ctx): Promise<Card> {
  ctx.session.$authorize()
  const card = await db.card.findFirst({
    where: {
      id: input.id,
      userId: ctx.session.userId,
    },
  })

  if (!card) throw new NotFoundError()

  return {
    ...card,
    answers: JSON.parse(card.answers),
  }
}
