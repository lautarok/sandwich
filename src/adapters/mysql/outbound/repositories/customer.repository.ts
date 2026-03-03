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
}