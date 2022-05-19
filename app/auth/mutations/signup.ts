import { resolver, SecurePassword } from "blitz"
import { Signup } from "app/auth/validations"
import { Role } from "types"
import { db } from "db"

export default resolver.pipe(resolver.zod(Signup), async ({ email, password }, ctx) => {
  const hashedPassword = await SecurePassword.hash(password.trim())
  const user = await db
    .insertInto("users")
    .values({
      email: email.toLowerCase().trim(),
      hashedPassword,
      role: "USER",
      updatedAt: new Date(),
      createInverse: false,
    })
    .returningAll()
    .executeTakeFirstOrThrow()

  await ctx.session.$create({ userId: user.id, role: user.role as Role })
  return user
})
