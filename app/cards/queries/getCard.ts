import { Ctx } from "blitz"
import { db } from "db"
import { sql } from "kysely"

interface GetCardInput {
  id: number
}

export default async function getCard(input: GetCardInput, ctx: Ctx) {
  ctx.session.$authorize()

  return await db
    .selectFrom("cards")
    .leftJoin("answers", "answers.cardId", "cards.id")
    .where("cards.id", "=", input.id)
    .where("cards.userId", "=", ctx.session.userId)
    .groupBy("cards.id")
    .selectAll("cards")
    .select(sql`json_agg(answers.*)`.as("answers"))
    .executeTakeFirstOrThrow()
}
