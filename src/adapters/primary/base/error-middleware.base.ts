import { type Request, type Response, type NextFunction } from "express"

export default class BaseErrorMiddleware {
    middleware: (
        _error: Error, _req: Request, _res: Response, _next: NextFunction
    ) => unknown = () => {}
}