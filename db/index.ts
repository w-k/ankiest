import { Pool } from "pg"

import { ColumnType, Generated, Kysely, PostgresDialect } from "kysely"

interface TokenTable {
  id: Generated<number>
  createdAt: ColumnType<Date, undefined, never>
  updatedAt: Date
  hashedToken: string
  type: string
  expiresAt: Date
  sentTo: string
  userId: number
}

interface SessionTable {
  id: Generated<number>
  userId: number
  createdAt: ColumnType<Date, undefined, never>
  updatedAt: Date
  expiresAt?: Date
  handle: string
  hashedSessionToken?: string
  antiCSRFToken?: string
  publicData?: string
  privateData?: string
}

export type Role = "ADMIN" | "USER"

interface UserTable {
  id: Generated<number>
  createdAt: ColumnType<Date, undefined, never>
  updatedAt: Date
  name?: string
  email: string
  hashedPassword?: string
  role: Role
  createInverse: boolean
}

export interface CardTable {
  id: Generated<number>
  createdAt: ColumnType<Date, undefined, never>
  updatedAt: Date
  question: string
  bucket: number
  lastReviewed: Date
  nextReview: Date
  userId: number
}

export interface AnswerTable {
  id: Generated<number>
  createdAt: ColumnType<Date, undefined, never>
  updatedAt: Date
  text: string
  cardId: number
}

interface Database {
  cards: CardTable
  answers: AnswerTable
  users: UserTable
  tokens: TokenTable
  sessions: SessionTable
}

let db: Kysely<Database>

let hasBeenAssigned = false

if (!hasBeenAssigned) {
  db = new Kysely<Database>({
    dialect: new PostgresDialect({
      pool: new Pool({
        connectionString: process.env.DATABASE_URL,
      }),
    }),
  })
  hasBeenAssigned = true
}

export { db }

// Auth sessions rely on Prisma client. But I don't want to use Prisma. Therefore I shim it.

// https://github.com/blitz-js/blitz/blob/5460fbb4842c7bda94af5ecd51481668f2cba93f/nextjs/packages/next/stdlib-server/auth-sessions.ts

const shim = {
  session: {
    findFirst: ({ where: { handle } }: any) => {
      return db
        .selectFrom("sessions")
        .where("sessions.handle", "=", handle)
        .selectAll()
        .executeTakeFirst()
    },

    findMany: ({ where: { userId } }: any) => {
      return db.selectFrom("sessions").where("sessions.userId", "=", userId).selectAll().execute()
    },

    // Sample input:
    //
    // {
    //    "data":{
    //       "expiresAt":"2022-06-20T05:30:10.964Z",
    //       "handle":"I3L_WZ-QYUH13XHYz6mGARM5wMlX1lN8:ots",
    //       "hashedSessionToken":"738c23c3f1d15465d0a145dea92c595afbf9b0a4db46363a9c5cc6e0fadb0807",
    //       "antiCSRFToken":"slcnwe_R9ACTaPSBEN6yXWN4Gy-2BPKK",
    //       "publicData":"{\"userId\":1,\"role\":\"USER\"}",
    //       "privateData":"{}",
    //       "user":{
    //          "connect":{
    //             "id":1
    //          }
    //       }
    //    }
    // }
    create: (input: any) => {
      const {
        data: {
          userId,
          user: {
            connect: { id },
          },
          ...session
        },
      } = input
      return db
        .insertInto("sessions")
        .values({
          ...session,
          userId: userId ?? id,
          updatedAt: new Date(),
        } as any)
        .executeTakeFirstOrThrow()
    },

    update: ({ where: { handle }, data: session }) => {
      return db
        .updateTable("sessions")
        .where("sessions.handle", "=", handle)
        .set(session)
        .executeTakeFirstOrThrow()
    },

    delete: ({ where: { handle } }) => {
      return db
        .deleteFrom("sessions")
        .where("sessions.handle", "=", handle)
        .executeTakeFirstOrThrow()
    },
  },
}

export default shim
