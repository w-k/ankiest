import { migrator } from "./migrator"

migrator
  .migrateUp()
  .then((result: any) => {
    console.log(result)
  })
  .catch((e: any) => {
    console.error(e)
  })
  .finally(() => {
    process.exit()
  })
