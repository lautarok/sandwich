import { CreateCustomer } from "../../../../application/usecases/customers/create-customer/createCustomer.ts"
import GetCustomerList from "../../../../application/usecases/customers/get-customer-list/getCustomerList.ts"
import { UpdateCustomer } from "../../../../application/usecases/customers/update-customer/updateCustomer.ts"
import { DeleteCustomer } from "../../../../application/usecases/customers/delete-customer/deleteCustomer.ts"
import BaseController from "../base/controller.base.ts"
import { type Request, type Response } from "express"

export default class CustomerController extends BaseController {

    constructor(
        private createCustomer: CreateCustomer,
        private getCustomerList: GetCustomerList,
        private updateCustomer: UpdateCustomer,
        private deleteCustomer: DeleteCustomer
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

    put = async (req: Request, res: Response) => {
        const { id } = req.params as { id: string }
        const body = req.body as {
            name?: string,
            surname?: string
        }

        const result = await this.updateCustomer.execute(parseInt(id), body)

        res.status(200).json(result)
    }

    delete = async (req: Request, res: Response) => {
        const { id } = req.params as { id: string }

        await this.deleteCustomer.execute(parseInt(id))

        res.status(204).send()
    }
}