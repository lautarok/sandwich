import { type Request, type Response } from "express"
import ParseLexer from "../../../usecases/parse-lexer/parseLexer.ts"
import ParseSyntax from "../../../usecases/parse-syntax/parseSyntax.ts"
import BaseController from "../base/controller.base.ts"
import ParseSemantic from "../../../usecases/parse-semantic/parseSemantic.ts"

interface deps {
    parseLexer: ParseLexer
    parseSyntax: ParseSyntax
    parseSemantic: ParseSemantic
}

export default class ParseMessageController implements BaseController {
    parseLexer: ParseLexer
    parseSyntax: ParseSyntax
    parseSemantic: ParseSemantic

    constructor(deps: deps) {
        this.parseLexer = deps.parseLexer
        this.parseSyntax = deps.parseSyntax
        this.parseSemantic = deps.parseSemantic
    }

    get = (req: Request, res: Response) => {
        const message = req.query["message"] as string

        const lexerResult = this.parseLexer.execute(message),
            syntaxResult = this.parseSyntax.execute(lexerResult),
            semanticResult = this.parseSemantic.execute(syntaxResult)

        res.status(200).json({
            originalMessage: message,
            lexerResult,
            syntaxResult,
            semanticResult
        })
    }
}