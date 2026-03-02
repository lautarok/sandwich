import CustomerRepository from "../../../../adapters/mysql/outbound/repositories/customer.repository.ts"
import type Customer from "../../../../domain/entities/customer.ts"
import type BaseUsecase from "../../../base/baseUsecase.ts"

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
    }: {
        page: number,
        limit: number
    }) {
        return this.customerRepository.findMany({
            page, limit
        })
    }
}