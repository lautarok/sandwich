export default abstract class BaseUsecase<T> {
    abstract execute(...args: any[]): T | Promise<T>
}