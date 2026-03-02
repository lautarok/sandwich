import express from "express"
import ParseMessageController from "./controllers/parse-message.controller.ts"
import ParseLexer from "../../../application/usecases/parser/parse-lexer/parseLexer.ts"
import ParseSyntax from "../../../application/usecases/parser/parse-syntax/parseSyntax.ts"
import HasMessageMiddleware from "./middlewares/has-message.middleware.ts"
import ParseSemantic from "../../../application/usecases/parser/parse-semantic/parseSemantic.ts"
import HasCustomerMiddleware from "./middlewares/has-customer.middleware.ts"
import CustomerController from "./controllers/customer.controller.ts"
import { CreateCustomer } from "../../../application/usecases/customers/create-customer/createCustomer.ts"

interface deps {
    parseLexer: ParseLexer
    parseSyntax: ParseSyntax
    parseSemantic: ParseSemantic
    createCustomer: CreateCustomer
}

export default function router(deps: deps) {
    const hasMessageMiddleware = new HasMessageMiddleware,
        hasCustomerMiddleware = new HasCustomerMiddleware

    const parseMessageController = new ParseMessageController({
        parseLexer: deps.parseLexer,
        parseSyntax: deps.parseSyntax,
        parseSemantic: deps.parseSemantic
    })

    const customerController = new CustomerController({
        createCustomer: deps.createCustomer
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

    return routerGroup
}