import express from "express"
import ParseMessageController from "./controllers/parse-message.controller.ts"
import ParseLexer from "../../../application/usecases/parser/parse-lexer/parseLexer.ts"
import ParseSyntax from "../../../application/usecases/parser/parse-syntax/parseSyntax.ts"
import HasMessageMiddleware from "./middlewares/has-message.middleware.ts"
import ParseSemantic from "../../../application/usecases/parser/parse-semantic/parseSemantic.ts"
import HasCustomerMiddleware from "./middlewares/has-customer.middleware.ts"
import CustomerController from "./controllers/customer.controller.ts"
import { CreateCustomer } from "../../../application/usecases/customers/create-customer/createCustomer.ts"
import PaginationMiddleware from "./middlewares/pagination.middleware.ts"
import GetCustomerList from "../../../application/usecases/customers/get-customer-list/getCustomerList.ts"
import CreateCustomerContact from "../../../application/usecases/customer-contacts/create-customer-contact/createCustomerContact.ts"
import GetCustomerContactList from "../../../application/usecases/customer-contacts/get-customer-contact-list/getCustomerContactList.ts"
import HasCustomerContactMiddleware from "./middlewares/has-customer-contact.middleware.ts"
import CustomerContactController from "./controllers/customer-contact.controller.ts"
import HasOrderMiddleware from "./middlewares/has-order.middleware.ts"
import OrderController from "./controllers/order.controller.ts"
import CreateOrder from "../../../application/usecases/orders/create-order/createOrder.ts"
import GetOrderList from "../../../application/usecases/orders/get-order-list/getOrderList.ts"

export default class ExpressRouter {
    private readonly paginationMiddleware: PaginationMiddleware
    private readonly hasMessageMiddleware: HasMessageMiddleware
    private readonly hasCustomerMiddleware: HasCustomerMiddleware
    private readonly hasCustomerContactMiddleware: HasCustomerContactMiddleware
    private readonly hasOrderMiddleware: HasOrderMiddleware

    private readonly parseMessageController: ParseMessageController
    private readonly customerController: CustomerController
    private readonly customerContactController: CustomerContactController
    private readonly orderController: OrderController

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
    ) {
        this.paginationMiddleware = new PaginationMiddleware
        this.hasMessageMiddleware = new HasMessageMiddleware
        this.hasCustomerMiddleware = new HasCustomerMiddleware
        this.hasCustomerContactMiddleware = new HasCustomerContactMiddleware
        this.hasOrderMiddleware = new HasOrderMiddleware

        this.parseMessageController = new ParseMessageController(
            this.parseLexer, this.parseSyntax, this.parseSemantic
        )
        this.customerController = new CustomerController(
            this.createCustomer, this.getCustomerList
        )
        this.customerContactController = new CustomerContactController(
            this.createCustomerContact, this.getCustomerContactList
        )
        this.orderController = new OrderController(
            this.createOrder,
            this.getOrderList
        )
    }

    getRouterGroup() {
        const routerGroup = express.Router()

        routerGroup.get(
            "parse-message",
            this.hasMessageMiddleware.middleware,
            this.parseMessageController.get
        )

        const customerRouter = express.Router()
        customerRouter.get(
            "/",
            this.paginationMiddleware.middleware,
            this.customerController.get
        )
        customerRouter.post(
            "/",
            this.hasCustomerMiddleware.middleware,
            this.customerController.post
        )
        routerGroup.use("/customer", customerRouter)

        const customerContactRouter = express.Router()
        customerContactRouter.get(
            "/",
            this.paginationMiddleware.middleware,
            this.customerContactController.get
        )
        customerContactRouter.post(
            "/",
            this.hasCustomerContactMiddleware.middleware,
            this.customerContactController.post
        )
        routerGroup.use("/customer-contact", customerContactRouter)

        const orderRouter = express.Router()
        orderRouter.get(
            "/",
            this.paginationMiddleware.middleware,
            this.orderController.get
        )
        orderRouter.post(
            "/",
            this.hasOrderMiddleware.middleware,
            this.orderController.post
        )
        routerGroup.use("/order", orderRouter)

        return routerGroup
    }
}