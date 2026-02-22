import express from "express"
import ParseMessageController from "./controllers/parse-message.controller.ts"
import ParseLexer from "../../usecases/parse-lexer/parseLexer.ts"
import ParseSyntax from "../../usecases/parse-syntax/parseSyntax.ts"
import HasMessageMiddleware from "./middlewares/has-message.middleware.ts"
import ParseSemantic from "../../usecases/parse-semantic/parseSemantic.ts"

interface deps {
    parseLexer: ParseLexer
    parseSyntax: ParseSyntax
    parseSemantic: ParseSemantic
}

export default function router(deps: deps) {
    const hasMessageMiddleware = new HasMessageMiddleware

    const parseMessageController = new ParseMessageController({
        parseLexer: deps.parseLexer,
        parseSyntax: deps.parseSyntax,
        parseSemantic: deps.parseSemantic
    })

    const routerGroup = express.Router()

    routerGroup.get(
        "/parse-message",
        hasMessageMiddleware.middleware,
        parseMessageController.get
    )

    return routerGroup
}