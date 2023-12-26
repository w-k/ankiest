import { resolver } from "@blitzjs/rpc"
import { Signup } from "app/auth/validations"
import { Role } from "types"
import { db } from "db"
import { hash } from "password"

export default resolver.pipe(resolver.zod(Signup), async ({ email, password }, ctx) => {
  const hashedPassword = await hash(password.trim())
  const user = await db
    .insertInto("users")
    .values({
      email: email.toLowerCase().trim(),
      hashedPassword: hashedPassword.toString(),
      role: "USER",
      updatedAt: new Date(),
      createInverse: false,
    })
    .returningAll()
    .executeTakeFirstOrThrow()

  await ctx.session.$create({ userId: user.id, role: user.role as Role })
  return user
})
