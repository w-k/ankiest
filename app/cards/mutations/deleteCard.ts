import { resolver } from "blitz"
import db from "db"
import { z } from "zod"

const DeleteCard = z.object({
  id: z.number(),
})

export default resolver.pipe(resolver.zod(DeleteCard), resolver.authorize(), async ({ id }) => {
  // TODO: in multi-tenant app, you must add validation to ensure correct tenant
  const card = await db.card.deleteMany({ where: { id } })

  return card
})
