import { CreateCustomer } from "../../../../application/usecases/customers/create-customer/createCustomer.ts"
import GetCustomerList from "../../../../application/usecases/customers/get-customer-list/getCustomerList.ts"
import BaseController from "../base/controller.base.ts"
import { type Request, type Response } from "express"

export default class CustomerController extends BaseController {

    constructor(
        private createCustomer: CreateCustomer,
        private getCustomerList: GetCustomerList
    ) {
        super()
    }

    get = async (_: Request, res: Response) => {
        const pagination = res.locals.pagination as {
            page: number,
            limit: number
        }

        const {count, list} = await this.getCustomerList.execute(pagination)

        res.status(200).json({
            count,
            list
        })
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