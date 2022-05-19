import { Ctx, NotFoundError, SecurePassword } from "blitz"
import { ChangePassword } from "../validations"
import { db } from "db"
import { z } from "zod"

export default async function changePassword(input: z.infer<typeof ChangePassword>, ctx: Ctx) {
  ctx.session.$authorize()
  const hashedPassword = await SecurePassword.hash(input.newPassword.trim())
  const result = await db
    .updateTable("users")
    .set({
      hashedPassword,
    })
    .where("users.id", "=", ctx.session.userId)
    .executeTakeFirstOrThrow()

  if (result.numUpdatedRows !== BigInt(1)) {
    throw new NotFoundError()
  }
  return true
}
