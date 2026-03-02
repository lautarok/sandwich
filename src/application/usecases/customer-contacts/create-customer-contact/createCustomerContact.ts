import type CustomerContact from "../../../../domain/entities/customerContact.ts"
import type BaseUsecase from "../../../base/baseUsecase.ts"

interface CustomerContactRepository {
    createOne(customerContact: CustomerContact): Promise<CustomerContact>
}

interface deps {
    customerContactRepository: CustomerContactRepository
}

export default class CreateCustomerContact implements BaseUsecase<CustomerContact> {
    customerContactRepository: CustomerContactRepository

    constructor(deps: deps) {
        this.customerContactRepository = deps.customerContactRepository
    }

    execute(data: {
        customerId: number
        type: "whatsapp" | "instagram" | "facebook"
        value: string
    }): Promise<CustomerContact> {
        return this.customerContactRepository.createOne(data as CustomerContact)
    }
}