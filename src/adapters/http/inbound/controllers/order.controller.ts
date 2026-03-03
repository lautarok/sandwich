import PaginationInput from "../../../../application/dtos/pagination.input.ts"
import CreateOrder from "../../../../application/usecases/orders/create-order/createOrder.ts"
import GetOrderList from "../../../../application/usecases/orders/get-order-list/getOrderList.ts"
import BaseController from "../base/controller.base.ts"
import { type Request, type Response } from "express"

export default class OrderController extends BaseController {
    constructor(
        private readonly createOrder: CreateOrder,
        private readonly getOrderList: GetOrderList
    ) {
        super()
    }

    get = async (_: Request, res: Response) => {
        const pagination = res.locals.pagination as PaginationInput
        
        const result = await this.getOrderList.execute(pagination)

        res.status(200).json(result)
    }

    post = async (req: Request, res: Response) => {
        const body = req.body as {
            customerId: number
            items: {
                name: string
                feature: string
                price: number
                quantity: number
            }[]
        }

        const result = await this.createOrder.execute(body)

        res.status(201).json(result)
    }
}