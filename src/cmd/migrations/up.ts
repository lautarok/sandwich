import path from "path"
import MysqlAdapter from "../../adapters/mysql/mysql.ts"
import fs from "fs/promises"
import { SQL_FILES_DIR } from "./config.ts"
import mysql2 from "mysql2"

const mysqlAdapter = new MysqlAdapter({
    multipleStatements: true
})

const sqlFiles = await fs.readdir(SQL_FILES_DIR)

await mysqlAdapter.runInTransaction(async pool => {
    await pool.execute(`
        CREATE TABLE IF NOT EXISTS migrations (
            id BIGINT PRIMARY KEY AUTO_INCREMENT
            file_name VARCHAR(100)
        );
    `)

    for await (const file of sqlFiles) {
        if (!file.endsWith(".up.sql")) {
            continue
        }

        const [rows] = await pool.execute<{file_name: string}[] & mysql2.QueryResult>(`
            SELECT * FROM migrations
            WHERE file_name = '${file}'
        `)

        if (rows.length > 0) {
            return
        }

        const fileContent = (await fs.readFile(
            path.resolve(
                SQL_FILES_DIR, file
            ),
            "utf-8"
        )).toString()

        await pool.query(fileContent)

        await pool.execute(`
            INSERT INTO migrations (
                file_name
            ) VALUES (
                '${file}'
            )
        `)
    }
})

console.log("Migration success")