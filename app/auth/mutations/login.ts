import { AuthenticationError, resolver, SecurePassword } from "blitz"
import { Login } from "../validations"
import { Role } from "types"
import { db } from "db"

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
  if (!user) {
    throw new AuthenticationError()
  }

  const result = await SecurePassword.verify(user.hashedPassword, password)

  if (result === SecurePassword.VALID_NEEDS_REHASH) {
    // Upgrade hashed password with a more secure hash
    const improvedHash = await SecurePassword.hash(password)
    await db
      .updateTable("users")
      .set({ hashedPassword: improvedHash })
      .where("users.id", "=", user.id)
      .executeTakeFirstOrThrow()
  }

  const { hashedPassword, ...rest } = user
  return rest
}

export default resolver.pipe(resolver.zod(Login), async ({ email, password }, ctx) => {
  // This throws an error if credentials are invalid
  const user = await authenticateUser(email, password)
  const userId = user.id

  await ctx.session.$create({ userId, role: user.role as Role })

  return user
})
