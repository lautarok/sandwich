export default abstract class BaseUsecase {
    abstract execute(...args: any[]): unknown | Promise<unknown>
}