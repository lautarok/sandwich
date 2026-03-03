import type Customer from "../../../../domain/entities/customer.ts"
import type BaseUsecase from "../../../base/baseUsecase.ts"
import type PaginationInput from "../../../dtos/pagination.input.ts"

interface CustomerRepository {
    findMany: (pagination: PaginationInput) => Promise<{
        list: Customer[],
        count: number
    }>
}

export default class GetCustomerList implements BaseUsecase {
    constructor(
        private readonly customerRepository: CustomerRepository
    ) {}

    execute({
        page,
        limit
    }: PaginationInput) {
        return this.customerRepository.findMany({
            page, limit
        })
    }
}