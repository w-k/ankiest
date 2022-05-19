import { Ctx } from "blitz"
import { db } from "db"

export default async function getCurrentUser(_: null, { session }: Ctx) {
  if (!session.userId) return null

  const user = await db
    .selectFrom("users")
    .selectAll()
    .where("users.id", "=", session.userId)
    .executeTakeFirstOrThrow()

  return user
}
