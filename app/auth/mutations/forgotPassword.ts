import { Ctx, generateToken, hash256 } from "blitz"
import { db } from "db"
import { forgotPasswordMailer } from "mailers/forgotPasswordMailer"
import { z } from "zod"
import { ForgotPassword } from "../validations"

const RESET_PASSWORD_TOKEN_EXPIRATION_IN_HOURS = 4

export default async function forgotPassword(input: z.infer<typeof ForgotPassword>, ctx: Ctx) {
  // 1. Get the user
  const user = await db
    .selectFrom("users")
    .where("users.email", "=", input.email.toLowerCase())
    .selectAll()
    .executeTakeFirstOrThrow()

  // 2. Generate the token and expiration date.
  const token = generateToken()
  const hashedToken = hash256(token)
  const expiresAt = new Date()
  expiresAt.setHours(expiresAt.getHours() + RESET_PASSWORD_TOKEN_EXPIRATION_IN_HOURS)

  // 3. If user with this email was found
  if (user) {
    // 4. Delete any existing password reset tokens
    await db
      .deleteFrom("tokens")
      .where("tokens.type", "=", "RESET_PASSWORD")
      .where("tokens.userId", "=", user.id)
      .execute()
    // 5. Save this new token in the database.
    await db
      .insertInto("tokens")
      .values({
        userId: user.id,
        type: "RESET_PASSWORD",
        updatedAt: new Date(),
        expiresAt,
        hashedToken,
        sentTo: user.email,
      })
      .executeTakeFirstOrThrow()
    // 6. Send the email
    await forgotPasswordMailer({ to: user.email, token }).send()
  } else {
    // 7. If no user found wait the same time so attackers can't tell the difference
    await new Promise((resolve) => setTimeout(resolve, 500 + Math.random() * 500))
  }

  // 8. Return the same result whether a password reset email was sent or not
  return
}
