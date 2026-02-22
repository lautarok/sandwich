import AppError from "../domain/appError.ts"

export default class InvalidInputError extends AppError {
    constructor(message?: string) {
        super(message || "wrong input", "invalid input")
    }
}