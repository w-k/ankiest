import { DefaultCtx, SessionContext, SimpleRolesIsAuthorized } from "blitz"
import { AnswerTable, CardTable } from "db"
import { Selectable } from "kysely"

// Note: You should switch to Postgres and then use a DB enum for role type
export type Role = "ADMIN" | "USER"

declare module "blitz" {
  export interface Ctx extends DefaultCtx {
    session: SessionContext
  }
  export interface Session {
    isAuthorized: SimpleRolesIsAuthorized<Role>
    PublicData: {
      userId: number
      role: Role
    }
  }
}

export type Card = Selectable<CardTable>
export type Answer = Selectable<AnswerTable>

export type CardWithAnswers = Card & {
  answers: Array<Answer>
}
