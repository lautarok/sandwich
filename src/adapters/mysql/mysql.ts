import mysql2 from "mysql2/promise"

export default class MysqlAdapter {
    private pool: mysql2.Pool

    constructor(options?: {
        multipleStatements?: boolean
    }) {
        this.pool = mysql2.createPool({
            uri: process.env.MYSQL_URI,
            multipleStatements: !!options?.multipleStatements
        })
    }

    getPool() {
        return this.pool
    }

    async runInTransaction(callback: (pool: mysql2.PoolConnection) => Promise<void>) {
        const connection = await this.pool.getConnection()

        try {
            await connection.beginTransaction()
            const result = await callback(connection)
            await connection.commit()
            return result
        } catch (error) {
            await connection.rollback()
            throw error
        } finally {
            connection.release()
        }
    }
}