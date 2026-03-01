import type OrderItem from "./orderItem.ts"

export default interface Order {
    items: OrderItem[]
}