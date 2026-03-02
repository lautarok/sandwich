import { type Request, type Response } from "express"

export default abstract class BaseController {
    private sendMethodNotAllowed(res: Response) {
        res.status(405).json({
            message: "method not allowed"
        })
    }

    get(req: Request, res: Response) {
        this.sendMethodNotAllowed(res)
    }

    post(req: Request, res: Response) {
        this.sendMethodNotAllowed(res)
    }

    put(req: Request, res: Response) {
        this.sendMethodNotAllowed(res)
    }

    patch(req: Request, res: Response) {
        this.sendMethodNotAllowed(res)
    }

    delete(req: Request, res: Response) {
        this.sendMethodNotAllowed(res)
    }
}