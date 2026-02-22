import { type Request, type Response, type NextFunction } from "express"

export default class BaseMiddleware {
    middleware: (
        _req: Request, _res: Response, _next: NextFunction
    ) => unknown = () => {}
}