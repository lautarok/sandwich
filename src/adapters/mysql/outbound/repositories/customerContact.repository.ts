import mysql2 from "mysql2/promise"
import type PaginationInput from "../../../../application/dtos/pagination.input.ts"
import type CustomerContact from "../../../../domain/entities/customerContact.ts"
import BaseRepository from "../base/repository.base.ts"
import MysqlAdapter from "../../mysql.ts"

export default class CustomerContactRepository extends BaseRepository<CustomerContact> {
    constructor(
        mysqlAdapter: MysqlAdapter
    ) {
        super(mysqlAdapter)
    }

    async findMany(dto: PaginationInput, poolCtx?: mysql2.Pool) {
        const pool = poolCtx ?? this.mysqlAdapter.getPool()

        const [list] = await pool.execute<unknown[] & mysql2.QueryResult>(`
            SELECT *
            FROM customer_contacts
            ORDER BY id DESC
            LIMIT ${dto.limit}
            OFFSET ${(dto.page - 1) * dto.limit}
        `)

        const [count] = await pool.execute(`
            SELECT COUNT(id)
            FROM customer_contacts
        `)

        return {
            list: list.map<CustomerContact>((item: unknown) => ({
                id: item["id"],
                type: item["type"],
                value: item["value"],
                createdAt: item["created_at"],
                updatedAt: item["updated_at"]
            })),
            count: count[0]["COUNT(id)"]
        }
    }

    async createOne(
        model: CustomerContact & {customerId: number},
        poolCtx?: mysql2.Pool
    ): Promise<CustomerContact> {
        const pool = poolCtx ?? this.mysqlAdapter.getPool()

        const [result] = await pool.execute<mysql2.ResultSetHeader>(`
            INSERT INTO customer_contacts (
                customer_id, type, value
            ) VALUES (
                '${model.customerId}', '${model.type}', '${model.value}'
            )
        `)

        const [rows] = await pool.execute<CustomerContact & mysql2.QueryResult>(`
            SELECT *
            FROM customer_contacts
            WHERE id = ${result.insertId}    
        `)

        return rows[0]
    }
}