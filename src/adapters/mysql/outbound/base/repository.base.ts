import mysql2 from "mysql2/promise"
import PaginationInput from "../../../../application/dtos/pagination.input.ts"

export default interface BaseRepository<T> {
    findMany(dto: PaginationInput, poolCtx?: mysql2.Pool): Promise<T[]>
    createOne(model: T, poolCtx?: mysql2.Pool): Promise<T>
}