import express from "express"
import ParseLexer from "../../../application/usecases/parser/parse-lexer/parseLexer.ts"
import ParseSyntax from "../../../application/usecases/parser/parse-syntax/parseSyntax.ts"
import GlobalErrorsMiddleware from "./middlewares/global-errors.middleware.ts"
import CorsMiddleware from "./middlewares/cors.middleware.ts"
import ParseSemantic from "../../../application/usecases/parser/parse-semantic/parseSemantic.ts"
import { CreateCustomer } from "../../../application/usecases/customers/create-customer/createCustomer.ts"
import GetCustomerList from "../../../application/usecases/customers/get-customer-list/getCustomerList.ts"
import CreateCustomerContact from "../../../application/usecases/customer-contacts/create-customer-contact/createCustomerContact.ts"
import GetCustomerContactList from "../../../application/usecases/customer-contacts/get-customer-contact-list/getCustomerContactList.ts"
import CreateOrder from "../../../application/usecases/orders/create-order/createOrder.ts"
import ExpressRouter from "./expressRouter.ts"
import GetOrderList from "../../../application/usecases/orders/get-order-list/getOrderList.ts"

export default class ExpressAdapter {
    constructor(
        private readonly parseLexer: ParseLexer,
        private readonly parseSyntax: ParseSyntax,
        private readonly parseSemantic: ParseSemantic,
        private readonly createCustomer: CreateCustomer,
        private readonly getCustomerList: GetCustomerList,
        private readonly createCustomerContact: CreateCustomerContact,
        private readonly getCustomerContactList: GetCustomerContactList,
        private readonly createOrder: CreateOrder,
        private readonly getOrderList: GetOrderList
    ) {}

    run(port: number | string): Promise<void> {
        return new Promise((resolve, reject) => {
            const app = express()

            const corsMiddleware = new CorsMiddleware
            app.use(corsMiddleware.middleware)

            app.use(express.json())

            const router = new ExpressRouter(
                this.parseLexer,
                this.parseSyntax,
                this.parseSemantic,
                this.createCustomer,
                this.getCustomerList,
                this.createCustomerContact,
                this.getCustomerContactList,
                this.createOrder,
                this.getOrderList
            )
            app.use("/api/v1", router.getRouterGroup())

            const globalErrorsMiddleware = new GlobalErrorsMiddleware
            app.use(globalErrorsMiddleware.middleware)

            app.listen(port).on("listening", () => {
                resolve()
            }).on("error", error => {
                reject(error)
            })
        })
    }
}