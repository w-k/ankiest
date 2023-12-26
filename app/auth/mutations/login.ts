import { Ctx } from "blitz"
import { Login } from "../validations"
import { z } from "zod"
import { Role } from "types"
import { db } from "db"
import { hash, verify } from "password"
import { AuthenticationError } from "blitz"
import SecurePassword from "secure-password"

export const authenticateUser = async (rawEmail: string, rawPassword: string) => {
  const { email, password } = Login.parse({
    email: rawEmail,
    password: rawPassword,
  })
  const user = await db
    .selectFrom("users")
    .where("users.email", "=", email)
    .selectAll()
    .executeTakeFirstOrThrow()
  if (!user?.hashedPassword) {
    throw new AuthenticationError()
  }

  const result = await verify(user.hashedPassword, password)

  if (result === SecurePassword.VALID_NEEDS_REHASH) {
    // Upgrade hashed password with a more secure hash
    const improvedHash = await hash(password)
    await db
      .updateTable("users")
      .set({ hashedPassword: improvedHash })
      .where("users.id", "=", user.id)
      .executeTakeFirstOrThrow()
  } else if (result === SecurePassword.INVALID) {
    // TODO: handle invalid password
    console.error("Invalid password")
  }

  const { hashedPassword, ...rest } = user
  return rest
}

export default async function login({ email, password }: z.infer<typeof Login>, ctx: Ctx) {
  const user = await authenticateUser(email, password)
  const userId = user.id

  await ctx.session.$create({ userId, role: user.role as Role })

  return user
}
