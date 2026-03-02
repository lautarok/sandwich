import { type Request, type Response, type NextFunction } from "express"
import BaseMiddleware from "../base/middleware.base.ts"
import InvalidInputError from "../../../../errors/invalidInput.error.ts"

export default class HasCustomerContactMiddleware implements BaseMiddleware {
    middleware = (req: Request, res: Response, next: NextFunction) => {
        const body = req.body

        if (!body) {
            throw new InvalidInputError("wrong body")
        }

        if(!body["customerId"]) {
            throw new InvalidInputError("`customerId` field is required")
        } else if (!Number.isInteger(body["customerId"]) || body["customerId"] <= 0) {
            throw new InvalidInputError("`customerId` field must be a positive int")
        }

        if (!body["type"]) {
            throw new InvalidInputError("`type` field is required")
        } else if (!/^(whatsapp|instagram|facebook)$/.test(body["type"])) {
            throw new InvalidInputError("`type` field only must be \"whatsapp\", \"instagram\" or \"facebook\"")
        }

        if (!body["value"]) {
            throw new InvalidInputError("`value` field is required")
        } else if (typeof body["value"] !== "string") {
            throw new InvalidInputError("`value` field must be a string")
        }

        return next()
    }
}