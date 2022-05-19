import { migrator } from "./migrator"

const migrationName = process.argv[1]

if (typeof migrationName !== "string") {
  console.warn("No migration name specified")
  process.exit()
}

migrator
  .migrateTo(migrationName)
  .then((result: any) => {
    console.log(result)
  })
  .catch((e: any) => {
    console.error(e)
  })
  .finally(() => {
    process.exit()
  })
