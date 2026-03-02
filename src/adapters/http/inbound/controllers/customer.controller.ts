import { CreateCustomer } from "../../../../application/usecases/customers/create-customer/createCustomer.ts"
import BaseController from "../base/controller.base.ts"
import { type Request, type Response } from "express"

interface deps {
    createCustomer: CreateCustomer
}

export default class CustomerController extends BaseController {
    private createCustomer: CreateCustomer

    constructor(deps: deps) {
        super()
        this.createCustomer = deps.createCustomer
    }

    post = async (req: Request, res: Response) => {
        const body = req.body as {
            name: string,
            surname?: string
        }

        const result = await this.createCustomer.execute(body)

        res.status(201).json(result)
    }
}