import { paginate, resolver } from "blitz"
import db, { Prisma } from "db"

interface GetCardsInput
  extends Pick<Prisma.CardFindManyArgs, "where" | "orderBy" | "skip" | "take"> {}

export default resolver.pipe(
  resolver.authorize(),
  async ({ where, orderBy, skip = 0, take = 100 }: GetCardsInput) => {
    // TODO: in multi-tenant app, you must add validation to ensure correct tenant
    const {
      items: cards,
      hasMore,
      nextPage,
      count,
    } = await paginate({
      skip,
      take,
      count: () => db.card.count({ where }),
      query: (paginateArgs) => db.card.findMany({ ...paginateArgs, where, orderBy }),
    })

    return {
      cards: cards.map((card) => ({
        ...card,
        answers: JSON.parse(card.answers).join(" | "),
      })),
      nextPage,
      hasMore,
      count,
    }
  }
)
