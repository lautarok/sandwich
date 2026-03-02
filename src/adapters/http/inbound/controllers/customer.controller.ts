import { CreateCustomer } from "../../../../application/usecases/customers/create-customer/createCustomer.ts"
import GetCustomerList from "../../../../application/usecases/customers/get-customer-list/getCustomerList.ts"
import BaseController from "../base/controller.base.ts"
import { type Request, type Response } from "express"

interface deps {
    createCustomer: CreateCustomer
    getCustomerList: GetCustomerList
}

export default class CustomerController extends BaseController {
    private createCustomer: CreateCustomer
    private getCustomerList: GetCustomerList

    constructor(deps: deps) {
        super()
        this.createCustomer = deps.createCustomer
        this.getCustomerList = deps.getCustomerList
    }

    get = async (_: Request, res: Response) => {
        const pagination = res.locals.pagination as {
            page: number,
            limit: number
        }

        const result = await this.getCustomerList.execute(pagination)

        res.status(200).json(result)
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