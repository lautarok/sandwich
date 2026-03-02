import mysql2 from "mysql2/promise"
import type PaginationInput from "../../../../application/dtos/pagination.input.ts"
import type Order from "../../../../domain/entities/order.ts"
import type BaseRepository from "../base/repository.base.ts"
import MysqlAdapter from "../../mysql.ts"

interface deps {
    adapter: MysqlAdapter
}

export default class OrderRepository implements BaseRepository<Order> {
    private adapter: MysqlAdapter

    constructor(deps: deps) {
        this.adapter = deps.adapter
    }

    async findMany(dto: PaginationInput, poolCtx?: mysql2.Pool): Promise<Order[]> {
        const pool = poolCtx ?? this.adapter.getPool()

        const [rows] = await pool.execute<Order[] & mysql2.QueryResult>(`
            SELECT * FROM orders
            ORDER BY id DESC
            SKIP ${(dto.page - 1) * dto.limit}
            LIMIT ${dto.limit}
        `)
        
        return rows
    }

    async findOne(id: number, poolCtx?: mysql2.Pool): Promise<Order> {
        const pool = poolCtx ?? this.adapter.getPool()

        const [rows] = await pool.execute<Order[] & mysql2.QueryResult>(`
            SELECT *
            FROM orders
            WHERE id = ${id}
        `)

        return rows[0] as Order
    }

    async createOne(order: Order, poolCtx?: mysql2.Pool): Promise<Order> {
        const pool = poolCtx ?? this.adapter.getPool()

        const [result] = await pool.execute<mysql2.ResultSetHeader>(`
            INSERT INTO orders (customer)
            VALUES ('${order.customer}')
        `)
        
        const [rows] = await pool.execute<Order[] & mysql2.QueryResult>(`
            SELECT *
            FROM orders
            WHERE id = ${result.insertId}
        `)

        return rows[0] as Order
    }
}