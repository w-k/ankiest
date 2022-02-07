import { Ctx } from "blitz"
import db from "db"
// import type { UserSelect } from "@prisma/client"

export default async function getCurrentUser(
  select: any = { id: true, name: true, email: true, role: true },
  { session }: Ctx
) {
  if (!session.userId) return null

  const user = await db.user.findFirst({
    where: { id: session.userId },
    select,
  })

  return user
}
