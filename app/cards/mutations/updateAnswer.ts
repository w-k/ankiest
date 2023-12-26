import { Ctx, NotFoundError } from "blitz"
import { db } from "db"
import { z } from "zod"

const UpdateAnswer = z.object({
  id: z.number(),
  text: z.string(),
})

export default async function updateAnswer(input: z.infer<typeof UpdateAnswer>, ctx: Ctx) {
  ctx.session.$authorize()

  const result = await db
    .updateTable("answers")
    .set({
      text: input.text,
    })
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
    .where("answers.id", "=", input.id)
    .executeTakeFirstOrThrow()

  if (result.numUpdatedRows !== BigInt(1)) {
    throw new NotFoundError()
  }

  return result
}
