import Customer from "./customer.ts"
import OrderItem from "./orderItem.ts"

export default interface Order {
    id: number
    customer: Customer
    items: OrderItem[]
    createdAt: Date
    updatedAt: Date
}