import { Ctx } from "blitz"
import { z } from "zod"
import { Pool } from "pg"
import {
  ColumnType,
  Generated,
  InsertObject,
  Kysely,
  PostgresDialect,
  ValueExpression,
} from "kysely"

const CreateManyCards = z.array(
  z.object({
    question: z.string(),
    answer: z.string(),
  })
)

export default async function createManyCards(input: z.infer<typeof CreateManyCards>, ctx: Ctx) {
  ctx.session.$authorize()

  interface CardTable {
    id: Generated<number>
    createdAt: ColumnType<Date, undefined, never>
    updatedAt: Date
    question: string
    bucket: number
    lastReviewed: Date
    nextReview: Date
    userId: number
  }

  interface AnswerTable {
    id: Generated<number>
    createdAt: ColumnType<Date, undefined, never>
    updatedAt: Date
    text: string
    cardId: number
  }

  interface Database {
    Card: CardTable
    Answer: AnswerTable
  }

  const db = new Kysely<Database>({
    dialect: new PostgresDialect({
      pool: new Pool({
        host: "localhost",
        database: "ankier",
      }),
    }),
  })

  const cardsResult = await db
    .insertInto("Card")
    .values(
      input.map(({ question }) => ({
        question,
        bucket: 0,
        updatedAt: new Date(),
        lastReviewed: new Date(),
        nextReview: new Date(),
        userId: ctx.session.userId!,
      }))
    )
    .returning("id")
    .execute()

  await db
    .insertInto("Answer")
    .values(
      input.map(({ answer }, index) => ({
        text: answer,
        cardId: cardsResult[index]!.id,
        updatedAt: new Date(),
      }))
    )
    .execute()
}
