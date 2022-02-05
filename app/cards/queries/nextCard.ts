import { CardWithAnswers } from "app/components/CardWithAnswers"
import { Ctx } from "blitz"
import db from "db"

interface NextCardInput {
  avoidCardId?: number
}

interface NextCardResponse {
  card?: CardWithAnswers
}

export default async function nextCard(input: NextCardInput, ctx: Ctx): Promise<NextCardResponse> {
  ctx.session.$authorize()
  const today = new Date().toISOString().slice(0, 10)
  const cards = await db.$queryRawUnsafe<{ id: number }[]>(`
  SELECT
    "Card"."id"
  FROM
    "Card"
  JOIN "Answer" on "Card"."id"="Answer"."cardId"
  WHERE
    "Card"."userId" = ${ctx.session.userId}
    and("Card"."nextReview" IS NULL
      OR date("Card"."nextReview") <= date('${today}'))
  ORDER BY
    "Card"."bucket" DESC,
    "Card"."nextReview" IS NULL DESC,
    date("Card"."nextReview"),
    "Card"."id" = ${input.avoidCardId ?? "NULL"} ASC,
    random() ASC
  LIMIT 1
  `)

  if (!cards[0]) {
    return {}
  }

  const card = await db.card.findFirst({
    where: {
      id: cards[0].id,
    },
    include: {
      answers: true,
    },
  })

  if (!card) {
    return {}
  }

  return { card }
}
