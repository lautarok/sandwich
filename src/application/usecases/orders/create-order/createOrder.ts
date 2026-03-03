import type Order from "../../../../domain/entities/order.ts";
import type OrderItem from "../../../../domain/entities/orderItem.ts";
import type PersistencePort from "../../../../ports/persistence.port.ts";
import type BaseUsecase from "../../../base/baseUsecase.ts";

interface OrderRepository {
    createOne(order: Order, ctx: unknown): Promise<Order>
}

interface OrderItemRepository {
    createOne(order: OrderItem & {orderId: number}, ctx: unknown): Promise<OrderItem>
}

export default class CreateOrder implements BaseUsecase {
    constructor(
        private readonly persistence: PersistencePort,
        private readonly orderRepository: OrderRepository,
        private readonly orderItemRepository: OrderItemRepository
    ) {}

    async execute({
        customerId,
        items
    }: {
        customerId: number
        items: {
            name: string
            feature: string
            quantity: number
            price: number
        }[]
    }) {
        const order = {
            customer: {
                id: customerId
            }
        }

        let output: null | Order = null

        await this.persistence.runInTransaction(async (ctx: unknown) => {
            const insertedOrder = await this.orderRepository.createOne(order as Order, ctx)

            let insertedOrderItems: OrderItem[] = []
            for await (const item of items) {
                insertedOrderItems.push(
                    await this.orderItemRepository.createOne({
                        ...(item as unknown as OrderItem),
                        orderId: insertedOrder.id
                    }, ctx)
                )
            }

            output = {
                ...insertedOrder,
                items: insertedOrderItems
            }
        })

        return output
    }
}