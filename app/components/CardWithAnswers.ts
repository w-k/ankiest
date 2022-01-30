import { Prisma } from "@prisma/client"

export type CardWithAnswers = Prisma.CardGetPayload<{
  include: {
    answers: true
  }
}>
