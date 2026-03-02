import type Customer from "../../../../domain/entities/customer.ts"
import BaseUsecase from "../../../base/baseUsecase.ts"

interface CustomerRepository {
    createOne({name, surname}: {
        name: string,
        surname?: string
    }): Promise<Customer>
}

interface deps {
    customerRepository: CustomerRepository
}

export class CreateCustomer implements BaseUsecase<Customer> {
    customerRepository: CustomerRepository

    constructor(deps: deps) {
        this.customerRepository = deps.customerRepository
    }

    async execute({
        name,
        surname
    }: {
        name: string,
        surname?: string
    }) {
        return await this.customerRepository.createOne({
            name, surname
        })
    }
}