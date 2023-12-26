// import { api } from "app/blitz-server";
// import { NextApiHandler } from "next";
// import { getSession } from "@blitzjs/auth";
// import updateCard from "app/cards/mutations/updateCard"
// import getCard from "app/cards/queries/getCard"
// import nextCardAndStats from "app/cards/queries/nextCardAndStats"
// import addDays from "date-fns/addDays"
// import { NotFoundError } from "blitz";

// const bucketDelay = (bucket: number) => {
//   if (bucket === 0) {
//     return 0
//   }
//   return Math.pow(2, bucket - 1)
// }

// // TODO: move it to a mutation
// const handler: NextApiHandler = async (req, res) => {
//   const session = await getSession(req, res)
//   const userId = session.userId as number
//   const { cardId, isCorrect } = req.body
//   const card = await getCard({
//     id: cardId
//   }, { req, res });
//   if (!card) {
//     throw new NotFoundError()
//   }
//   const newBucket = isCorrect ? card.bucket + 1 : 0
//   const delay = bucketDelay(newBucket)
//   await updateCard({
//     id: cardId,
//     userId,
//     bucket: newBucket,
//     lastReviewed: new Date(),
//     nextReview: addDays(new Date(), delay),
//   }, { req, res });
//   const nextCardResult = await nextCardAndStats({ avoidCardId: cardId }, { req, res });
//   res.status(200).json(nextCardResult)
// }

// export default api(handler);
