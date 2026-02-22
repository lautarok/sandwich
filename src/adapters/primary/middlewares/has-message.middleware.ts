import { type NextFunction, type Request, type Response } from "express"
import InvalidInputError from "../../../errors/invalidInput.error.ts"
import BaseMiddleware from "../base/middleware.base.ts"

export default class HasMessageMiddleware implements BaseMiddleware {
    middleware = (req: Request, _: Response, next: NextFunction) => {
        const query = req.query

        if (!query) {
            throw new InvalidInputError("wrong query")
        } else if (!query["message"]) {
            throw new InvalidInputError("`message` query is required")
        } else if (typeof query["message"] !== "string") {
            throw new InvalidInputError("`message` query must be a string value")
        } else if (query["message"].trim().length === 0) {
            throw new InvalidInputError("`message` query is empty")
        }

        next()
    }
}