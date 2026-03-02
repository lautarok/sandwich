import type CustomerContact from "../../../../domain/entities/customerContact.ts"
import type BaseUsecase from "../../../base/baseUsecase.ts"
import type PaginationInput from "../../../dtos/pagination.input.ts"

interface CustomerContactRepository {
    findMany: (pagination: PaginationInput) => Promise<CustomerContact[]>
}

interface deps {
    customerContactRepository: CustomerContactRepository
}

export default class GetCustomerContactList implements BaseUsecase<CustomerContact[]> {
    customerContactRepository: CustomerContactRepository

    constructor(deps: deps) {
        this.customerContactRepository = deps.customerContactRepository
    }

    execute(pagination: PaginationInput): Promise<CustomerContact[]> {
        return this.customerContactRepository.findMany(pagination)
    }
}