import express from "express"
import ParseLexer from "../../../application/usecases/parser/parse-lexer/parseLexer.ts"
import ParseSyntax from "../../../application/usecases/parser/parse-syntax/parseSyntax.ts"
import router from "./router.ts"
import GlobalErrorsMiddleware from "./middlewares/global-errors.middleware.ts"
import CorsMiddleware from "./middlewares/cors.middleware.ts"
import ParseSemantic from "../../../application/usecases/parser/parse-semantic/parseSemantic.ts"
import { CreateCustomer } from "../../../application/usecases/customers/create-customer/createCustomer.ts"

interface deps {
    parseLexer: ParseLexer
    parseSyntax: ParseSyntax
    parseSemantic: ParseSemantic
    createCustomer: CreateCustomer
}

export default class ExpressAdapter {
    private parseLexer: ParseLexer
    private parseSyntax: ParseSyntax
    private parseSemantic: ParseSemantic
    private createCustomer: CreateCustomer

    constructor(deps: deps) {
        this.parseLexer = deps.parseLexer
        this.parseSyntax = deps.parseSyntax
        this.parseSemantic = deps.parseSemantic
        this.createCustomer = deps.createCustomer
    }

    run(port: number | string): Promise<void> {
        return new Promise((resolve, reject) => {
            const app = express()

            const corsMiddleware = new CorsMiddleware
            app.use(corsMiddleware.middleware)

            app.use(express.json())

            app.use("/api/v1", router({
                parseLexer: this.parseLexer,
                parseSyntax: this.parseSyntax,
                parseSemantic: this.parseSemantic,
                createCustomer: this.createCustomer
            }))

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