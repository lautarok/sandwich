import Order from "../../../../domain/entities/order.ts"
import BaseUsecase from "../../../base/baseUsecase.ts"
import PaginationInput from "../../../dtos/pagination.input.ts"

interface OrderRepository {
    findMany(dto: PaginationInput, ctx?: unknown): Promise<{
        list: Order[]
        count: number
    }>
}

export default class GetOrderList implements BaseUsecase {
    constructor(
        private readonly orderRepository: OrderRepository
    ) {}

    execute(dto: PaginationInput) {
        return this.orderRepository.findMany(dto)
    }
}