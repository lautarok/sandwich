import { type Request, type Response, type NextFunction } from "express"
import BaseMiddleware from "../base/middleware.base.ts"
import InvalidInputError from "../../../../errors/invalidInput.error.ts"

export default class HasCustomerMiddleware implements BaseMiddleware {
    middleware = (req: Request, _: Response, next: NextFunction) => {
        if (!req.body) {
            throw new InvalidInputError("wrong body")
        }

        if (!req.body["name"]) {
            throw new InvalidInputError("`name` field is required in body")
        } else if (typeof req.body["name"] !== "string") {
            throw new InvalidInputError("`name` field must be a string value")
        } else if (req.body["name"].trim().length === 0) {
            throw new InvalidInputError("`name` field is required")
        } else if (req.body["name"].trim().length > 100) {
            throw new InvalidInputError("`name` field value is too long")
        }

        if (req.body["surname"]) {
            if (typeof req.body["surname"] !== "string") {
                throw new InvalidInputError("`surname` field must be a string value")
            } else if (req.body["surname"].trim().length === 0) {
                throw new InvalidInputError("`surname` field is required")
            } else if (req.body["surname"].trim().length > 100) {
                throw new InvalidInputError("`surname` field value is too long")
            }
        }

        return next()
    }
}