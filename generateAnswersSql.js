const data = require("./answers.json")
data.forEach((row) => {
  const answers = JSON.parse(row.answers)
  answers.forEach((answer) => {
    console.log(
      `INSERT INTO "Answer" ("Answer"."cardId", "Answer"."text") values(${row.id}, '${answer}')`
    )
  })
})
