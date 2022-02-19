import { CardWithAnswers } from "app/components/CardWithAnswers"
import { Ctx } from "blitz"
import db from "db"

export interface NextCardInput {
  avoidCardId?: number
}

export interface Stats {
  leftToReview: number
  reviewedToday: number
}

export interface NextCardResponse {
  card?: CardWithAnswers
  stats: Stats
}

export default async function nextCardAndStats(
  input: NextCardInput,
  ctx: Ctx
): Promise<NextCardResponse> {
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
    date("Card"."lastReviewed") = date(now()) ASC,
    random() ASC
  LIMIT 1
  `)

  const statsResult = await db.$queryRaw<{ leftToReview: number; reviewedToday: number }[]>`
  SELECT
    "leftToReview"."count" "leftToReview",
    "reviewedToday"."count" "reviewedToday"
  FROM 
    (
      SELECT
        count(*) "count"
      FROM
        "Card"
      WHERE
        date("Card"."nextReview") <= date(now()) OR "Card"."nextReview" IS NULL
    ) AS "leftToReview", 
    (
      SELECT
        count(*) "count"
      FROM
        "Card"
      WHERE
        date("Card"."lastReviewed") = date(now())
        AND date("Card"."nextReview") > date(now())
    ) AS "reviewedToday"
  `
  const stats = statsResult[0]!

  if (!cards[0]) {
    return { stats }
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
    return { stats }
  }

  return { card, stats }
}
