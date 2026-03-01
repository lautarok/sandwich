import mysql2 from "mysql2/promise"

interface deps {
    multipleStatements?: boolean
}

export default class MysqlAdapter {
    private pool: mysql2.Pool

    constructor(deps?: deps) {
        this.pool = mysql2.createPool({
            uri: process.env.MYSQL_URI,
            multipleStatements: !!deps?.multipleStatements
        })
    }

    getPool() {
        return this.pool
    }

    async runInTransaction(callback: (pool: mysql2.PoolConnection) => Promise<void>) {
        const connection = await this.pool.getConnection()

        try {
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