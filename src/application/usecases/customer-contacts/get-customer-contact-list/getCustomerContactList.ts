import type CustomerContact from "../../../../domain/entities/customerContact.ts"
import type BaseUsecase from "../../../base/baseUsecase.ts"
import type PaginationInput from "../../../dtos/pagination.input.ts"

interface CustomerContactRepository {
    findMany: (pagination: PaginationInput) => Promise<{
        list: CustomerContact[],
        count: number
    }>
}

export default class GetCustomerContactList implements BaseUsecase {
    constructor(
        private readonly customerContactRepository: CustomerContactRepository
    ) {}

    async execute(pagination: PaginationInput) {
        return await this.customerContactRepository.findMany(pagination)
    }
}