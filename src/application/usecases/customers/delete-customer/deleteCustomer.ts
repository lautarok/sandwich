import BaseUsecase from "../../../base/baseUsecase.ts"

interface CustomerRepository {
    deleteOne(id: number): Promise<void>
}

export class DeleteCustomer implements BaseUsecase {
    constructor(
        private readonly customerRepository: CustomerRepository
    ) {}

    async execute(id: number) {
        await this.customerRepository.deleteOne(id)
    }
}