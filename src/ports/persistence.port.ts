export default interface PersistencePort {
    runInTransaction: (ctx: unknown) => Promise<void>
}