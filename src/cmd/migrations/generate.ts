import fs from "fs/promises"
import path from "path"
import { SQL_FILES_DIR } from "./config.ts"

const label = process.argv[3]

if (!label) {
    console.error("\nLabel is required.\nUsage: npm run migration:generate [label]\n")
    throw new Error("wrong label")
}

const prefix = new Date().getTime() + "_"

await fs.mkdir(SQL_FILES_DIR, {recursive: true})

await fs.writeFile(
    path.resolve(
        SQL_FILES_DIR,
        `${prefix}${label}.up.sql`
    ),
    "-- Your up commands here",
    {
        flag: "wx"
    }
)

await fs.writeFile(
    path.resolve(
        SQL_FILES_DIR,
        `${prefix}${label}.down.sql`
    ),
    "-- Your rollback commands here"
)