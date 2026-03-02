import { type Request, type Response, type NextFunction } from "express"
import BaseMiddleware from "../base/middleware.base.ts"
import InvalidInputError from "../../../../errors/invalidInput.error.ts"

export default class PaginationMiddleware implements BaseMiddleware {
    middleware = (req: Request, res: Response, next: NextFunction) => {
        let page = "1",
            limit = "10"

        if (req.query?.["page"]) {
            page = req.query["page"].toString()
        }

        if (req.query?.["limit"]) {
            limit = req.query["limit"].toString()
        }

        const integerRegexp = /^\d+$/

        if (!integerRegexp.test(page)) {
            throw new InvalidInputError("`page` query must be integer")
        } else if (!integerRegexp.test(limit)) {
            throw new InvalidInputError("`limit` query must be integer")
        }

        const pageInt = parseInt(page),
            limitInt = parseInt(limit)

        if (pageInt < 1) {
            throw new InvalidInputError("`page` query must be at least 1")
        } else if (pageInt > 9999) {
            throw new InvalidInputError("`page` query must be a maximum of 9999")
        }

        if (limitInt < 1) {
            throw new InvalidInputError("`limit` query must be at least 1")
        } else if (limitInt > 35) {
            throw new InvalidInputError("`limit` query must be a maximum of 35")
        }

        res.locals.pagination = {
            page: pageInt,
            limit: limitInt
        }

        return next()
    }
}