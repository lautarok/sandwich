import Customer from "../../../../domain/entities/customer.ts"
import BaseUsecase from "../../../base/baseUsecase.ts"

interface deps {}

export class CreateCustomer implements BaseUsecase<Customer> {
    constructor(deps: deps) {

    }

    async execute(customer: Customer) {
        
    }
}