import express from "express"
import ParseLexer from "../../../usecases/parser/parse-lexer/parseLexer.ts"
import ParseSyntax from "../../../usecases/parser/parse-syntax/parseSyntax.ts"
import router from "./router.ts"
import GlobalErrorsMiddleware from "./middlewares/global-errors.middleware.ts"
import CorsMiddleware from "./middlewares/cors.middleware.ts"
import ParseSemantic from "../../../usecases/parser/parse-semantic/parseSemantic.ts"

interface deps {
    parseLexer: ParseLexer
    parseSyntax: ParseSyntax
    parseSemantic: ParseSemantic
}

export default class ExpressAdapter {
    parseLexer: ParseLexer
    parseSyntax: ParseSyntax
    parseSemantic: ParseSemantic

    constructor(deps: deps) {
        this.parseLexer = deps.parseLexer
        this.parseSyntax = deps.parseSyntax
        this.parseSemantic = deps.parseSemantic
    }

    run(port: number | string): Promise<void> {
        return new Promise((resolve, reject) => {
            const app = express()

            const corsMiddleware = new CorsMiddleware
            app.use(corsMiddleware.middleware)

            app.use("/api/v1", router({
                parseLexer: this.parseLexer,
                parseSyntax: this.parseSyntax,
                parseSemantic: this.parseSemantic
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