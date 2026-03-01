import AppError from "../domain/common/appError.ts"

export default class InvalidInputError extends AppError {
    constructor(message?: string) {
        super(message || "wrong input", "invalid input")
    }
}