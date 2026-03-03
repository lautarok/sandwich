import mysql2 from "mysql2/promise"
import type PaginationInput from "../../../../application/dtos/pagination.input.ts"
import type Order from "../../../../domain/entities/order.ts"
import BaseRepository from "../base/repository.base.ts"
import MysqlAdapter from "../../mysql.ts"
import type Customer from "../../../../domain/entities/customer.ts"
import OrderItem from "../../../../domain/parser/orderItem.ts"
import CustomerContact from "../../../../domain/entities/customerContact.ts"

export default class OrderRepository extends BaseRepository<Order> {
    constructor(
        mysqlAdapter: MysqlAdapter
    ) {
        super(mysqlAdapter)
    }

    async findMany(dto: PaginationInput, poolCtx?: mysql2.Pool){
        const pool = poolCtx ?? this.mysqlAdapter.getPool()

        const [list] = await pool.execute<unknown[] & mysql2.QueryResult>(`
            SELECT
                orders.*,
                IFNULL(
                    JSON_OBJECT(
                        'id', customers.id,
                        'name', customers.name,
                        'surname', customers.surname,
                        'contacts', IFNULL(
                            JSON_ARRAYAGG(
                                JSON_OBJECT(
                                    'id', customer_contacts.id,
                                    'type', customer_contacts.type,
                                    'value', customer_contacts.value,
                                    'created_at', customer_contacts.created_at,
                                    'updated_at', customer_contacts.updated_at
                                )
                            ),
                            JSON_ARRAY()
                        ),
                        'created_at', customers.created_at,
                        'updated_at', customers.updated_at
                    ),
                    NULL
                ) AS customer,
                IFNULL(
                    JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'id', order_items.id,
                            'name', order_items.name,
                            'features', order_items.features,
                            'price', order_items.price,
                            'quantity', order_items.quantity,
                            'updated_at', order_items.updated_at
                        )
                    ),
                    JSON_ARRAY()
                ) AS items
            FROM orders
            LEFT JOIN order_items
                ON orders.id = order_items.order_id
            LEFT JOIN customers
                ON customers.id = orders.customer_id
            LEFT JOIN customer_contacts
                ON customers.id = customer_contacts.customer_id
            GROUP BY orders.id
            ORDER BY id DESC
            LIMIT ${dto.limit}
            OFFSET ${(dto.page - 1) * dto.limit}
        `)

        const [count] = await pool.execute(`
            SELECT COUNT(id)
            FROM orders
        `)
        
        return {
            list: list.map<Order>((order: unknown) => ({
                id: order["id"],
                total: order["total"],
                customer: {
                    id: order["customer"]["id"],
                    name: order["customer"]["name"],
                    surname: order["customer"]["surname"],
                    contacts: order["customer"]["contacts"].map<CustomerContact>(
                        (contact: unknown) => ({
                            id: contact["id"],
                            type: contact["type"],
                            value: contact["value"],
                            createdAt: contact["created_at"],
                            updatedAt: contact["updated_at"]
                        })
                    ),
                    createdAt: order["customer"]["created_at"],
                    updatedAt: order["customer"]["updated_at"]
                } as Customer,
                items: order["items"].map<OrderItem>((item: unknown) => ({
                    id: item["id"],
                    name: item["name"],
                    features: item["features"],
                    price: item["price"],
                    quantity: item["quantity"],
                    updatedAt: item["updated_at"]
                })),
                createdAt: order["created_at"],
                updatedAt: order["updated_at"]
            })),
            count: count[0]["COUNT(id)"]
        }
    }

    async findOne(id: number, poolCtx?: mysql2.Pool): Promise<Order> {
        const pool = poolCtx ?? this.mysqlAdapter.getPool()

        const [rows] = await pool.execute(`
            SELECT *
            FROM orders
            WHERE id = ${id}
        `)

        return rows[0] as Order
    }

    async createOne(order: Order, poolCtx?: mysql2.Pool): Promise<Order> {
        const pool = poolCtx ?? this.mysqlAdapter.getPool()

        const [result] = await pool.execute<mysql2.ResultSetHeader>(`
            INSERT INTO orders (customer_id)
            VALUES ('${order.customer.id}')
        `)
        
        const [rows] = await pool.execute(`
            SELECT
                orders.*,
                IFNULL(
                    JSON_OBJECT(
                        'id', customers.id,
                        'name', customers.name,
                        'surname', customers.surname,
                        'contacts', IFNULL(
                            JSON_ARRAYAGG(
                                JSON_OBJECT(
                                    'id', customer_contacts.id,
                                    'type', customer_contacts.type,
                                    'value', customer_contacts.value,
                                    'created_at', customer_contacts.created_at,
                                    'updated_at', customer_contacts.updated_at
                                )
                            ),
                            JSON_ARRAY()
                        ),
                        'created_at', customers.created_at,
                        'updated_at', customers.updated_at
                    ),
                    JSON_ARRAY()
                ) as customer
            FROM orders
            LEFT JOIN customers
                ON customers.id = orders.customer_id
            LEFT JOIN customer_contacts
                ON customers.id = customer_contacts.customer_id
            WHERE orders.id = ${result.insertId}
        `)

        return {
            id: rows[0]["id"],
            total: rows[0]["total"],
            items: [],
            customer: {
                id: rows[0]["customer"]["id"],
                name: rows[0]["customer"]["name"],
                surname: rows[0]["customer"]["surname"],
                contacts: rows[0]["customer"]["contacts"].map<CustomerContact>((contact: unknown) => ({
                    id: contact["id"],
                    type: contact["type"],
                    value: contact["value"],
                    createdAt: contact["created_at"],
                    updatedAt: contact["updated_at"]
                })),
                createdAt: rows[0]["customer"]["created_at"],
                updatedAt: rows[0]["customer"]["updated_at"]
            },
            createdAt: rows[0]["created_at"],
            updatedAt: rows[0]["updated_at"]
        }
    }
}