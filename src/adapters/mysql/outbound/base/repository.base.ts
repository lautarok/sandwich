import mysql2 from "mysql2/promise"
import type PaginationInput from "../../../../application/dtos/pagination.input.ts"
import MysqlAdapter from "../../mysql.ts"

export default abstract class BaseRepository<T> {
    mysqlAdapter: MysqlAdapter

    constructor(
        mysqlAdapter: MysqlAdapter
    ) {
        this.mysqlAdapter = mysqlAdapter
    }

    private promiseNotImplemented<D>() {
        return new Promise<D>((_, reject) => {
            reject("not implemented")
        })
    }
    
    getPool(poolCtx?: mysql2.Pool) {
        return poolCtx ?? this.mysqlAdapter.getPool()
    }

    findMany(dto: PaginationInput, poolCtx?: mysql2.Pool) {
        return this.promiseNotImplemented<{
            list: T[],
            count: number
        }>()
    }

    createOne(model: T, poolCtx?: mysql2.Pool) {
        return this.promiseNotImplemented<T>()
    }
}