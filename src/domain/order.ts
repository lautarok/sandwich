import type OrderItem from "./orderItem.ts"

export default interface Order {
    date: Date,
    customer: string,
    items: OrderItem[]
}