import { type Request, type Response } from "express"
import ParseLexer from "../../../../application/usecases/parser/parse-lexer/parseLexer.ts"
import ParseSyntax from "../../../../application/usecases/parser/parse-syntax/parseSyntax.ts"
import BaseController from "../base/controller.base.ts"
import ParseSemantic from "../../../../application/usecases/parser/parse-semantic/parseSemantic.ts"

interface deps {
    parseLexer: ParseLexer
    parseSyntax: ParseSyntax
    parseSemantic: ParseSemantic
}

export default class ParseMessageController implements BaseController {
    private parseLexer: ParseLexer
    private parseSyntax: ParseSyntax
    private parseSemantic: ParseSemantic

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