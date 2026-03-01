import mysql2 from "mysql2/promise"
import PaginationInput from "../../../../application/dtos/pagination.input.ts"
import Customer from "../../../../domain/entities/customer.ts"
import BaseRepository from "../base/repository.base.ts"
import MysqlAdapter from "../../mysql.ts"

interface deps {
    adapter: MysqlAdapter
}

export default class CustomerRepository implements BaseRepository<Customer> {
    adapter: MysqlAdapter

    constructor(deps: deps) {
        this.adapter = deps.adapter
    }

    async findMany(dto: PaginationInput, poolCtx?: mysql2.Pool): Promise<Customer[]> {
        const pool = poolCtx ?? this.adapter.getPool()
        
        const [rows] = await pool.execute<Customer[] & mysql2.QueryResult>(`
            SELECT * FROM customers
            ORDER BY id DESC
            SKIP ${(dto.page - 1) * dto.limit}
            LIMIT ${dto.limit}
        `)
        
        return rows
    }

    async createOne(model: Customer, poolCtx?: mysql2.Pool): Promise<Customer> {
        const pool = poolCtx ?? this.adapter.getPool()
        
        const [result] = await pool.execute<mysql2.ResultSetHeader>(`
            INSERT INTO customers (name, surname)
            VALUES ('${model.name}', '${model.surname}')
        `)
        
        const [rows] = await pool.execute<Customer[] & mysql2.QueryResult>(`
            SELECT *
            FROM orders
            WHERE id = ${result.insertId}
        `)

        return rows[0] as Customer
    }
}