import { type NextFunction, type Request, type Response } from "express"
import InvalidInputError from "../../../errors/invalidInput.error.ts"
import BaseErrorMiddleware from "../base/error-middleware.base.ts"

export default class GlobalErrorsMiddleware implements BaseErrorMiddleware {
    middleware = (error: Error, _: Request, res: Response, next: NextFunction) => {
        if (!error) {
            next()
            return
        } else if (error instanceof InvalidInputError) {
            res.status(400).json({
                error: error.name,
                message: error.message
            })
            return
        } else {
            console.error(error)
            res.status(500).json({
                error: "internal error",
                message: "internal server error"
            })
        }
    }
}