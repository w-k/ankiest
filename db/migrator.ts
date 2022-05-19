import { db } from "db"
import { FileMigrationProvider, Migrator } from "kysely"
import { promises as fs } from "fs"
import path from "path"

export const migrator = new Migrator({
  db,
  provider: new FileMigrationProvider({
    fs,
    path,
    migrationFolder: "db/migrations",
  }),
})
