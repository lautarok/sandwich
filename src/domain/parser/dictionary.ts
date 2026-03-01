export default interface Dictionary {
    products: Record<string, string>,
    features: Record<string, string>,
    quantities: Record<string, number>,
    conjunctions: string[],
    terminators: string[]
}