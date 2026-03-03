export default interface ProductRule {
    default?: string,
    multiplicator?: number,
    quantityStep?: number,
    features?: {name: string, addPrice?: number}[]
    alternate?: string[]
    price?: number
}