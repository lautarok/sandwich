import type CustomerContact from "../../../../domain/entities/customerContact.ts"
import type BaseUsecase from "../../../base/baseUsecase.ts"

interface CustomerContactRepository {
    createOne(customerContact: CustomerContact): Promise<CustomerContact>
}

export default class CreateCustomerContact implements BaseUsecase {
    constructor(
        private readonly customerContactRepository: CustomerContactRepository
    ) {}

    execute(data: {
        customerId: number
        type: "whatsapp" | "instagram" | "facebook"
        value: string
    }): Promise<CustomerContact> {
        return this.customerContactRepository.createOne(data as CustomerContact)
    }
}