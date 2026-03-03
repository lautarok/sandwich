import { Request, Response, NextFunction } from "express"
import BaseMiddleware from "../base/middleware.base.ts"
import InvalidInputError from "../../../../errors/invalidInput.error.ts"

export default class HasOrderMiddleware implements BaseMiddleware {
    middleware = (req: Request, res: Response, next: NextFunction) => {
        const body = req.body

        if (!body) {
            throw new InvalidInputError("wrong body")
        }

        if (!body["customerId"]) {
            throw new InvalidInputError("`customerId` field is required")
        } else if (
            typeof body["customerId"] !== "number"
            || !Number.isInteger(body["customerId"])
        ) {
            throw new InvalidInputError("`customerId` must be a integer")
        } else if (
            body["customerId"] <= 0
        ) {
            throw new InvalidInputError("`customerId` must be a positive integer")
        } else if (
            body["customerId"] >= 9999
        ) {
            throw new InvalidInputError("`customerId` must be a maximum of 9999")
        }

        if (!body["total"]) {
            throw new InvalidInputError("`total` field is required")
        } else if (
            body["total"] <= 0
        ) {
            throw new InvalidInputError("`total` must be a positive number")
        } else if (
            body["total"] >= 99999999.999
        ) {
            throw new InvalidInputError("`total` must be a maximum of 99999999.999")
        }

        if (!body["items"]) {
            throw new InvalidInputError("`items` field is required")
        } else if (!Array.isArray(body["items"])) {
            throw new InvalidInputError("`items` field must be `item object` array")
        } else if (body["items"].length === 0) {
            throw new InvalidInputError("`items` field must contains at least 1 `item object`")
        }

        for (const item of body["items"]) {
            if (!item["name"]) {
                throw new InvalidInputError("`name` field of `item object` is required")
            } else if (typeof item["name"] !== "string") {
                throw new InvalidInputError("`name` field of `item object` must be string")
            } else if (item["name"].trim().length === 0) {
                throw new InvalidInputError("`name` field of `item object` must contains at least 1 character")
            }

            if (item["feature"]) {
                if (typeof item["feature"] !== "string") {
                    throw new InvalidInputError("`feature` field of `item object` must be string")
                } else if (item["feature"].trim().length === 0) {
                    throw new InvalidInputError("`feature` field of `item object` must contains at least 1 character")
                }
            }

            if (!item["quantity"]) {
                throw new InvalidInputError("`quantity` field of `item object` is required")
            } else if (typeof item["quantity"] !== "number") {
                throw new InvalidInputError("`quantity` field of `item object` must be number")
            } else if (item["quantity"] <= 0) {
                throw new InvalidInputError("`quantity` field of `item object` must be at least 1")
            }

            if (!item["price"]) {
                throw new InvalidInputError("`price` field of `item object` is required")
            } else if (typeof item["price"] !== "number") {
                throw new InvalidInputError("`price` field of `item object` must be number")
            } else if (item["price"] <= 0) {
                throw new InvalidInputError("`price` field of `item object` must be at least 1")
            }
        }
        
        return next()
    }
}