import { Pool } from "pg"

import { ColumnType, Generated, Kysely, PostgresDialect } from "kysely"
import { PublicData, SessionConfigMethods, SessionModel } from "@blitzjs/auth"

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

const findFirst = async (handle: string): Promise<SessionModel | null> => {
  const result = db
    .selectFrom("sessions")
    .where("sessions.handle", "=", handle)
    .selectAll()
    .executeTakeFirst()
  const r = await result
  return r === undefined ? null : r
}

export const sessionConfigMethods: SessionConfigMethods = {
  getSession: async (handle: string): Promise<SessionModel | null> => {
    return findFirst(handle)
  },
  getSessions: async (userId: PublicData["userId"]): Promise<SessionModel[]> => {
    return db
      .selectFrom("sessions")
      .where("sessions.userId", "=", userId as number)
      .selectAll()
      .execute()
  },
  createSession: async (session: SessionModel): Promise<SessionModel> => {
    return db
      .insertInto("sessions")
      .values({
        ...session,
        updatedAt: new Date(),
        // TODO: it's complaining about userId for some reason
      } as any)
      .returningAll()
      .executeTakeFirstOrThrow()
  },
  updateSession: async (
    handle: string,
    session: Partial<SessionModel>
  ): Promise<SessionModel | undefined> => {
    return (
      db
        .updateTable("sessions")
        .where("sessions.handle", "=", handle)
        // TODO: also complaining about the type of userId
        .set(session as any)
        .returningAll()
        .executeTakeFirstOrThrow()
    )
  },
  deleteSession: async (handle: string): Promise<SessionModel | undefined> => {
    return db
      .deleteFrom("sessions")
      .where("sessions.handle", "=", handle)
      .returningAll()
      .executeTakeFirstOrThrow()
  },
}
