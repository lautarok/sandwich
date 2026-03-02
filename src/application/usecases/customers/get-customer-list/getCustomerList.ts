import type Customer from "../../../../domain/entities/customer.ts"
import type BaseUsecase from "../../../base/baseUsecase.ts"
import type PaginationInput from "../../../dtos/pagination.input.ts"

interface CustomerRepository {
    findMany: (pagination: PaginationInput) => Promise<Customer[]>
}

interface deps {
    customerRepository: CustomerRepository
}

export default class GetCustomerList implements BaseUsecase<Customer[]> {
    private customerRepository: CustomerRepository

    constructor(deps: deps) {
        this.customerRepository = deps.customerRepository
    }

    execute({
        page,
        limit
    }: PaginationInput) {
        return this.customerRepository.findMany({
            page, limit
        })
    }
}