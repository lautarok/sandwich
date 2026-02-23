import { type NextFunction, type Request, type Response } from "express"
import BaseMiddleware from "../base/middleware.base.ts"

export default class CorsMiddleware implements BaseMiddleware {
    middleware = (_: Request, res: Response, next: NextFunction) => {
        res.header("Content-Type", "application/json")
        res.header("Accept", "application/json")
        res.header("Access-Control-Allow-Origin", "*")
        res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
        res.header("Access-Control-Allow-Headers", "Content-Type, Accept")
        next()
    }
}