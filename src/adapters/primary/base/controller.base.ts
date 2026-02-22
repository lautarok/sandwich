import { type Request, type Response } from "express"

export default class BaseController {
    get: (_req: Request, _res: Response) => unknown = () => {}
}