import { Ctx } from "blitz"
import db, { Card, Prisma } from "db"

export default async function nextCard(_input: null, ctx: Ctx) {
  ctx.session.$authorize()
  const today = new Date().toISOString().slice(0, 10)
  const cardIds = await db.$queryRawUnsafe<Card>(`
  SELECT
    "Card"."id"
  FROM
    "Card"
  WHERE
    "Card"."userId" = ${ctx.session.userId}
    and("Card"."nextReview" IS NULL
      OR date("Card"."nextReview") <= date('${today}'))
  ORDER BY
    "Card"."bucket" DESC,
    "Card"."nextReview" IS NULL DESC,
    date("Card"."nextReview"),
    random() ASC
  LIMIT 1
  `)

  return cardIds[0]?.id
}
