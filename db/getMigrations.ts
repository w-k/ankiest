import { migrator } from "./migrator"

migrator
  .getMigrations()
  .then((migrations: any) => {
    for (const migration of migrations) {
      console.log(
        `${migration.executedAt ? "☑" : "☐"} ${migration.name}\t${migration.executedAt ?? ""}`
      )
    }
  })
  .catch((e: any) => {
    console.error(e)
  })
  .finally(() => {
    process.exit()
  })
