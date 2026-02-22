interface DictionaryPort {
    getProduct(word: string): string | null
    getFeature(word: string): string | null
    getQuantity(word: string): number | null
    isConjunction(word: string): boolean
    isTerminator(word: string): boolean
    getAllWords(): string[]
    isToken(word: string): boolean
}

export default DictionaryPort