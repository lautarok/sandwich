import mysql2 from "mysql2/promise"
import type PaginationInput from "../../../../application/dtos/pagination.input.ts"
import type CustomerContact from "../../../../domain/entities/customerContact.ts"
import type BaseRepository from "../base/repository.base.ts"
import MysqlAdapter from "../../mysql.ts"

interface deps {
    adapter: MysqlAdapter
}

export default class CustomerContactRepository implements BaseRepository<CustomerContact> {
    private adapter: MysqlAdapter

    constructor(deps: deps) {
        this.adapter = deps.adapter
    }

    async findMany(dto: PaginationInput, poolCtx?: mysql2.Pool): Promise<CustomerContact[]> {
        const pool = poolCtx ?? this.adapter.getPool()

        const [rows] = await pool.execute<CustomerContact[] & mysql2.QueryResult>(`
            SELECT *
            FROM customer_contacts
            ORDER BY id DESC
            LIMIT ${dto.limit}
            OFFSET ${(dto.page - 1) * dto.limit}
        `)

        return rows
    }

    async createOne(model: CustomerContact, poolCtx?: mysql2.Pool): Promise<CustomerContact> {
        const pool = poolCtx ?? this.adapter.getPool()

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