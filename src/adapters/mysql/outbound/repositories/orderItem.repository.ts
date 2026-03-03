import PaginationInput from "../../../../application/dtos/pagination.input.ts"
import OrderItem from "../../../../domain/entities/orderItem.ts"
import MysqlAdapter from "../../mysql.ts"
import BaseRepository from "../base/repository.base.ts"
import mysql2 from "mysql2/promise"

export default class OrderItemRepository extends BaseRepository<OrderItem> {
    constructor(
        mysqlAdapter: MysqlAdapter
    ) {
        super(mysqlAdapter)
    }

    async findMany(dto: PaginationInput, poolCtx?: mysql2.Pool) {
        const pool = this.getPool(poolCtx)

        const [list] = await pool.execute<unknown[] & mysql2.QueryResult>(`
            SELECT *
            FROM order_items
            ORDER BY id DESC
            LIMIT ${dto.limit}
            OFFSET ${(dto.page - 1) * dto.limit}
        `)

        const [count] = await pool.execute(`
            SELECT COUNT(id)
            FROM order_items
        `)

        return {
            list: list.map<OrderItem>((item: unknown) => ({
                id: item["id"],
                name: item["name"],
                features: item["features"],
                price: item["price"],
                quantity: item["quantity"],
                createdAt: item["created_at"],
                updatedAt: item["updated_at"]
            })),
            count: count[0]["COUNT(id)"]
        }
    }

    async createOne(model: OrderItem & {orderId: number}, poolCtx?: mysql2.Pool) {
        const pool = this.getPool(poolCtx)

        const [result] = await pool.execute<mysql2.ResultSetHeader>(`
            INSERT INTO order_items (
                order_id,
                name,
                features,
                price,
                quantity
            ) VALUES (
                ${model.orderId},
                '${model.name}',
                ${model.features ? `'${model.features}'` : "NULL"},
                ${model.price},
                ${model.quantity}
            )
        `)

        const [rows] = await pool.execute<OrderItem[] & mysql2.QueryResult>(`
            SELECT *
            FROM order_items
            WHERE id = ${result.insertId}
        `)

        return {
            id: rows[0]["id"],
            name: rows[0]["name"],
            features: rows[0]["features"],
            price: rows[0]["price"],
            quantity: rows[0]["quantity"],
            createdAt: rows[0]["created_at"],
            updatedAt: rows[0]["updated_at"]
        }
    }
}