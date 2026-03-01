import { readFile } from "fs/promises";
import MysqlAdapter from "../../adapters/mysql/mysql.ts";
import { SQL_FILES_DIR } from "./config.ts";
import path from "path";

const mysqlAdapter = new MysqlAdapter({
    multipleStatements: true
})

const pool = mysqlAdapter.getPool()

const [rows] = await pool.execute(`
    SELECT file_name
    FROM migrations
    ORDER BY id DESC    
`)

const migrations = rows as {"file_name": string}[]

for (const migration of migrations) {
    const sqlContent = (await readFile(
        path.resolve(
            SQL_FILES_DIR,
            migration["file_name"].replace(".up.sql", ".down.sql")
        )
    )).toString()

    await pool.execute(sqlContent)

    await pool.execute(`
        DELETE FROM migrations
        WHERE file_name = '${migration["file_name"]}'
    `)
}

console.log("Rollback success")