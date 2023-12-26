import { Ctx, NotFoundError } from "blitz"
import { db } from "db"
import { z } from "zod"

const DeleteCard = z.object({
  id: z.number(),
})

export default async function deleteCard({ id }: z.infer<typeof DeleteCard>, ctx: Ctx) {
  await db.transaction().execute(async (tx) => {
    ctx.session.$authorize()
    const q = tx
      .deleteFrom("answers")
      .where("answers.cardId", "=", id)
      .where(
        (q) =>
          q
            .selectFrom("cards")
            .select("cards.userId")
            .whereRef("answers.cardId", "=", "cards.id")
            .limit(1),
        "=",
        ctx.session.userId as number
      )

    await q.execute()
    const { numDeletedRows } = await tx
      .deleteFrom("cards")
      .where("cards.userId", "=", ctx.session.userId as number)
      .where("cards.id", "=", id)
      .executeTakeFirstOrThrow()
    if (numDeletedRows !== BigInt(1)) {
      throw new NotFoundError()
    }
  })
}
