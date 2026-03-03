import type Customer from "../../../../domain/entities/customer.ts"
import BaseUsecase from "../../../base/baseUsecase.ts"

interface CustomerRepository {
    createOne({name, surname}: {
        name: string,
        surname?: string
    }): Promise<Customer>
}

export class CreateCustomer implements BaseUsecase {
    constructor(
        private readonly customerRepository: CustomerRepository
    ) {}

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