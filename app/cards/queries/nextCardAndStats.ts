import { Ctx } from "blitz"
import { db } from "db"
import { sql } from "kysely"
import { CardWithAnswers } from "types"

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

  const card = (await db
    .selectFrom("cards")
    .leftJoin("answers", "answers.cardId", "cards.id")
    .selectAll("cards")
    .select(sql`json_agg(answers.*)`.as("answers"))
    .where("cards.userId", "=", ctx.session.userId as number)
    .where((q) =>
      q.or([
        q("cards.nextReview", "is", sql`null`),
        q(sql`date("cards"."nextReview")`, "<=", sql`date(now())`),
      ])
    )
    .groupBy("cards.id")
    .orderBy(sql`"cards"."lastReviewed" is null`, "desc")
    .orderBy(sql`date("cards"."lastReviewed") = date(now())`, "asc")
    .orderBy(sql`random()`, "asc")
    .executeTakeFirst()) as CardWithAnswers

  const leftToReview = await db
    .selectFrom("cards")
    .select([sql`count(*)`.as("count")])
    .where("cards.userId", "=", ctx.session.userId as number)
    .where((q) =>
      q.or([
        q(sql`date("cards"."nextReview")`, "<=", sql`date(now())`),
        q("cards.nextReview", "is", sql`null`),
      ])
    )
    .executeTakeFirst()

  const reviewedToday = await db
    .selectFrom("cards")
    .select([sql`count(*)`.as("count")])
    .where("cards.userId", "=", ctx.session.userId as number)
    .where(sql`date("cards"."lastReviewed")`, "=", sql`date(now())`)
    .where(sql`date("cards"."nextReview")`, ">", sql`date(now())`)
    .executeTakeFirst()

  const stats = {
    leftToReview: leftToReview ? parseInt(leftToReview.count as string) : 0,
    reviewedToday: reviewedToday ? parseInt(reviewedToday.count as string) : 0,
  }

  if (!card) {
    return { stats }
  }

  return { card, stats }
}
