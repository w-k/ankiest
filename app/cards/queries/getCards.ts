import { Ctx } from "blitz"
import { AnswerTable, db } from "db"
import { Selectable, sql } from "kysely"
import { CardWithAnswers } from "types"

type GetCardsInput = {
  query?: string
  limit?: number
  offset?: number
}

const isDefined = <T>(input: T): input is NonNullable<T> => input !== null && input !== undefined

export type Answer = Selectable<AnswerTable>

export interface GetCardsResponse {
  values: CardWithAnswers[]
  totalCount: number
}

export default async function getCards(
  input: GetCardsInput | undefined = {},
  ctx: Ctx
): Promise<GetCardsResponse> {
  ctx.session.$authorize()
  const { userId } = ctx.session
  if (!userId) {
    throw "Empty session user"
  }
  const { query, limit, offset } = input
  let sqlQuery = db
    .selectFrom("cards")
    .leftJoin("answers", "answers.cardId", "cards.id")
    .where("cards.userId", "=", userId as number)
  if (query && query.length) {
    sqlQuery = sqlQuery.where((q) =>
      q.or([q("answers.text", "like", `%${query}%`), q("cards.question", "like", `%${query}%`)])
    )
  }
  const total = await sqlQuery.select([sql`count(*)`.as("count")]).execute()

  sqlQuery = sqlQuery
    .orderBy("cards.createdAt", "desc")
    .groupBy("cards.id")
    .selectAll("cards")
    .select(sql`json_agg(answers.*)`.as("answers"))

  if (isDefined(limit) && isDefined(offset)) {
    sqlQuery = sqlQuery.offset(offset).limit(limit)
  }
  const queryResult = await sqlQuery.execute()
  return {
    values: queryResult as CardWithAnswers[],
    totalCount: (total[0]?.count as number) ?? 0,
  }
}
