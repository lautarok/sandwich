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

interface deps {
    parseLexer: ParseLexer
    parseSyntax: ParseSyntax
    parseSemantic: ParseSemantic
    createCustomer: CreateCustomer
    getCustomerList: GetCustomerList
    createCustomerContact: CreateCustomerContact
    getCustomerContactList: GetCustomerContactList
}

export default function router(deps: deps) {
    const paginationMiddleware = new PaginationMiddleware,
        hasMessageMiddleware = new HasMessageMiddleware,
        hasCustomerMiddleware = new HasCustomerMiddleware,
        hasCustomerContactMiddleware = new HasCustomerContactMiddleware

    const parseMessageController = new ParseMessageController({
        parseLexer: deps.parseLexer,
        parseSyntax: deps.parseSyntax,
        parseSemantic: deps.parseSemantic
    })

    const customerController = new CustomerController({
        createCustomer: deps.createCustomer,
        getCustomerList: deps.getCustomerList
    })

    const customerContactController = new CustomerContactController({
        createCustomerContact: deps.createCustomerContact,
        getCustomerContactList: deps.getCustomerContactList
    })

    const routerGroup = express.Router()

    routerGroup.get(
        "/parse-message",
        hasMessageMiddleware.middleware,
        parseMessageController.get
    )

    routerGroup.post(
        "/customer",
        hasCustomerMiddleware.middleware,
        customerController.post
    )

    routerGroup.get(
        "/customer",
        paginationMiddleware.middleware,
        customerController.get
    )

    routerGroup.post(
        "/customer-contact",
        hasCustomerContactMiddleware.middleware,
        customerContactController.post
    )

    routerGroup.get(
        "/customer-contact",
        paginationMiddleware.middleware,
        customerContactController.get
    )

    return routerGroup
}