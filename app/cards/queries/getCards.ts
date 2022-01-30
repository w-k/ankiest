import { Ctx, paginate } from "blitz"
import db, { Prisma } from "db"

interface GetCardsInput
  extends Pick<Prisma.CardFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default async function getCards(input: GetCardsInput, ctx: Ctx) {
  ctx.session.$authorize()
  const { where, orderBy, skip = 0, take = 100 } = input
  const {
    items: cards,
    hasMore,
    nextPage,
    count,
  } = await paginate({
    skip,
    take,
    count: () => db.card.count({ where }),
    query: (paginateArgs) =>
      db.card.findMany({
        ...paginateArgs,
        where: { ...where, userId: ctx.session.userId! },
        include: {
          answers: true,
        },
        orderBy,
      }),
  })
  return {
    cards,
    nextPage,
    hasMore,
    count,
  }
}
