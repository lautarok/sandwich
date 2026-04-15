import type Customer from "../../../../domain/entities/customer.ts"
import BaseUsecase from "../../../base/baseUsecase.ts"

interface CustomerRepository {
    updateOne(id: number, model: { name?: string, surname?: string }): Promise<Customer | null>
}

export class UpdateCustomer implements BaseUsecase {
    constructor(
        private readonly customerRepository: CustomerRepository
    ) {}

    async execute(id: number, {
        name,
        surname
    }: {
        name?: string,
        surname?: string
    }) {
        const customer = await this.customerRepository.updateOne(id, { name, surname })
        if (!customer) {
            throw new Error('Customer not found')
        }
        return customer
    }
}