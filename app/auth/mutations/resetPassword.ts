import { hash256, resolver, SecurePassword } from "blitz"
import { db } from "db"
import { ResetPassword } from "../validations"
import login from "./login"

export class ResetPasswordError extends Error {
  name = "ResetPasswordError"
  message = "Reset password link is invalid or it has expired."
}

export default resolver.pipe(resolver.zod(ResetPassword), async ({ password, token }, ctx) => {
  // 1. Try to find this token in the database
  const hashedToken = hash256(token)
  const possibleToken = await db
    .selectFrom("tokens")
    .where("tokens.hashedToken", "=", hashedToken)
    .where("tokens.type", "=", "RESET_PASSWORD")
    .selectAll()
    .executeTakeFirstOrThrow()

  // 2. If token not found, error
  if (!possibleToken) {
    throw new ResetPasswordError()
  }
  const savedToken = possibleToken

  // 3. Delete token so it can't be used again
  await db.deleteFrom("tokens").where("tokens.id", "=", savedToken.id).executeTakeFirstOrThrow()

  // 4. If token has expired, error
  if (savedToken.expiresAt < new Date()) {
    throw new ResetPasswordError()
  }

  // 5. Since token is valid, now we can update the user's password
  const hashedPassword = await SecurePassword.hash(password.trim())
  await db
    .updateTable("users")
    .where("users.id", "=", savedToken.userId)
    .set({ hashedPassword })
    .executeTakeFirstOrThrow()

  const user = await db
    .selectFrom("users")
    .where("users.id", "=", savedToken.userId)
    .selectAll()
    .executeTakeFirstOrThrow()

  // 6. Revoke all existing login sessions for this user
  await db.deleteFrom("sessions").where("sessions.userId", "=", user.id).execute()

  // 7. Now log the user in with the new credentials
  await login({ email: user.email, password }, ctx)

  return true
})
