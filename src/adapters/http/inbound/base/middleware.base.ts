import { type Request, type Response, type NextFunction } from "express"

export default class BaseMiddleware {
    middleware: (
        req: Request, res: Response, next: NextFunction
    ) => unknown = () => {}
}