import mysql2 from "mysql2/promise"
import type PaginationInput from "../../../../application/dtos/pagination.input.ts"
import BaseRepository from "../base/repository.base.ts"
import MysqlAdapter from "../../mysql.ts"
import type Customer from "../../../../domain/entities/customer.ts"
import CustomerContact from "../../../../domain/entities/customerContact.ts"

export default class CustomerRepository extends BaseRepository<Customer> {
    constructor(
        mysqlAdapter: MysqlAdapter
    ) {
        super(mysqlAdapter)
    }

    async findMany(dto: PaginationInput, poolCtx?: mysql2.Pool) {
        const pool = poolCtx ?? this.mysqlAdapter.getPool()
        
        const [list] = await pool.execute<unknown[] & mysql2.QueryResult>(`
            SELECT
                customers.*,
                IFNULL(
                    (
                        SELECT JSON_ARRAYAGG(
                            JSON_OBJECT(
                                'id', customer_contacts.id,
                                'type', customer_contacts.type,
                                'value', customer_contacts.value,
                                'created_at', customer_contacts.created_at,
                                'updated_at', customer_contacts.updated_at
                            )
                        )
                        FROM customer_contacts
                        WHERE customer_contacts.customer_id = customers.id
                    ),
                    JSON_ARRAY()
                ) AS contacts
            FROM customers
            GROUP BY customers.id
            ORDER BY customers.id DESC
            LIMIT ${dto.limit}
            OFFSET ${(dto.page - 1) * dto.limit}
        `)

        const [count] = await pool.execute(`
            SELECT COUNT(id)
            FROM customers
        `)
        
        return {
            list: list.map<Customer>((item: unknown) => ({
                id: item["id"],
                name: item["name"],
                surname: item["surname"] || undefined,
                contacts: (item["contacts"] as unknown[]).map<CustomerContact>(contact => ({
                    id: contact["id"],
                    type: contact["type"],
                    value: contact["value"],
                    createdAt: contact["created_at"],
                    updatedAt: contact["updated_at"]
                })),
                createdAt: item["created_at"],
                updatedAt: item["updated_at"]
            })),
            count: count[0]["COUNT(id)"]
        }
    }

    async createOne(model: Customer, poolCtx?: mysql2.Pool): Promise<Customer> {
        const pool = poolCtx ?? this.mysqlAdapter.getPool()
        
        const [result] = await pool.execute<mysql2.ResultSetHeader>(`
            INSERT INTO customers (name, surname)
            VALUES ('${model.name}', ${model.surname ? `'${model.surname}'` : "NULL"})
        `)
        
        const [rows] = await pool.execute(`
            SELECT *
            FROM customers
            WHERE id = ${result.insertId}
        `)

        return {
            id: rows[0]["id"],
            name: rows[0]["name"],
            surname: rows[0]["surname"],
            contacts: [],
            createdAt: rows[0]["created_at"],
            updatedAt: rows[0]["updated_at"]
        }
    }

    async findOne(id: number, poolCtx?: mysql2.Pool): Promise<Customer | null> {
        const pool = poolCtx ?? this.mysqlAdapter.getPool()
        
        const [rows] = await pool.execute(`
            SELECT
                customers.*,
                IFNULL(
                    (
                        SELECT JSON_ARRAYAGG(
                            JSON_OBJECT(
                                'id', customer_contacts.id,
                                'type', customer_contacts.type,
                                'value', customer_contacts.value,
                                'created_at', customer_contacts.created_at,
                                'updated_at', customer_contacts.updated_at
                            )
                        )
                        FROM customer_contacts
                        WHERE customer_contacts.customer_id = customers.id
                    ),
                    JSON_ARRAY()
                ) AS contacts
            FROM customers
            WHERE customers.id = ${id}
        `)

        if (rows.length === 0) {
            return null
        }

        const item = rows[0]
        return {
            id: item["id"],
            name: item["name"],
            surname: item["surname"] || undefined,
            contacts: (item["contacts"] as unknown[]).map<CustomerContact>(contact => ({
                id: contact["id"],
                type: contact["type"],
                value: contact["value"],
                createdAt: contact["created_at"],
                updatedAt: contact["updated_at"]
            })),
            createdAt: item["created_at"],
            updatedAt: item["updated_at"]
        }
    }

    async updateOne(id: number, model: { name?: string, surname?: string }, poolCtx?: mysql2.Pool): Promise<Customer | null> {
        const pool = poolCtx ?? this.mysqlAdapter.getPool()
        
        const updates = []
        if (model.name !== undefined) updates.push(`name = '${model.name}'`)
        if (model.surname !== undefined) updates.push(`surname = ${model.surname ? `'${model.surname}'` : "NULL"}`)
        
        if (updates.length === 0) {
            return await this.findOne(id, pool)
        }

        await pool.execute(`
            UPDATE customers
            SET ${updates.join(', ')}, updated_at = NOW()
            WHERE id = ${id}
        `)

        return await this.findOne(id, pool)
    }

    async deleteOne(id: number, poolCtx?: mysql2.Pool): Promise<void> {
        const pool = poolCtx ?? this.mysqlAdapter.getPool()
        
        await pool.execute(`
            DELETE FROM customers
            WHERE id = ${id}
        `)
    }
}