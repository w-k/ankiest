import { Ctx, NotFoundError } from "blitz"
import { ChangePassword } from "../validations"
import { db } from "db"
import { z } from "zod"
import { hash } from "password"

export default async function changePassword(input: z.infer<typeof ChangePassword>, ctx: Ctx) {
  ctx.session.$authorize()
  const hashedPassword = await hash(input.newPassword.trim())
  if (typeof ctx.session.userId !== "number") {
    throw new NotFoundError()
  }
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
