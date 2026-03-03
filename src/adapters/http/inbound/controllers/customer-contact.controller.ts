import CreateCustomerContact from "../../../../application/usecases/customer-contacts/create-customer-contact/createCustomerContact.ts"
import GetCustomerContactList from "../../../../application/usecases/customer-contacts/get-customer-contact-list/getCustomerContactList.ts"
import BaseController from "../base/controller.base.ts"
import { type Request, type Response } from "express"

export default class CustomerContactController extends BaseController {
    constructor(
        private readonly createCustomerContact: CreateCustomerContact,
        private readonly getCustomerContactList: GetCustomerContactList
    ) {
        super()
    }

    get = async (req: Request, res: Response) => {
        const pagination = res.locals.pagination

        const {count, list} = await this.getCustomerContactList.execute(pagination)

        res.status(200).json({
            count,
            list
        })
    }

    post = async (req: Request, res: Response) =>  {
        const body = req.body as {
            customerId: number
            type: "whatsapp" | "instagram" | "facebook"
            value: string
        }

        const result = await this.createCustomerContact.execute(body)

        res.status(201).json(result)
    }
}