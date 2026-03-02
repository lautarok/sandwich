import CreateCustomerContact from "../../../../application/usecases/customer-contacts/create-customer-contact/createCustomerContact.ts"
import GetCustomerContactList from "../../../../application/usecases/customer-contacts/get-customer-contact-list/getCustomerContactList.ts"
import BaseController from "../base/controller.base.ts"
import { type Request, type Response } from "express"

interface deps {
    createCustomerContact: CreateCustomerContact
    getCustomerContactList: GetCustomerContactList
}

export default class CustomerContactController extends BaseController {
    private readonly createCustomerContact: CreateCustomerContact
    private readonly getCustomerContactList: GetCustomerContactList

    constructor(deps: deps) {
        super()
        this.createCustomerContact = deps.createCustomerContact
        this.getCustomerContactList = deps.getCustomerContactList
    }

    get = async (req: Request, res: Response) => {
        const pagination = res.locals.pagination

        const result = await this.getCustomerContactList.execute(pagination)

        res.status(200).json(result)
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