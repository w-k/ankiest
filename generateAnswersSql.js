const data = require("./answers.json")
data.forEach((row) => {
  const answers = JSON.parse(row.answers)
  answers.forEach((answer) => {
    console.log(
      `INSERT INTO "answers" ("answers"."cardId", "answers"."text") values(${row.id}, '${answer}')`
    )
  })
})
