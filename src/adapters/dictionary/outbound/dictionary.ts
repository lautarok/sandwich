import type DictionaryPort from "../../../ports/dictionary.port.ts"
import type DictionaryType from "../../../domain/parser/dictionary.ts"

export default class Dictionary implements DictionaryPort {
    private dictionary: DictionaryType
    private wordList: string[]

    constructor(initialDictionary: DictionaryType) {
        this.dictionary = initialDictionary
        this.wordList = [
            ...Object.keys(initialDictionary.products),
            ...Object.keys(initialDictionary.features),
            ...Object.keys(initialDictionary.quantities),
            ...initialDictionary.conjunctions,
            ...initialDictionary.terminators
        ]
    }

    getProduct(word: string): string | null {
        return this.dictionary.products[word] ?? null
    }

    getFeature(word: string): string | null {
        return this.dictionary.features[word] ?? null
    }

    getQuantity(word: string): number | null {
        return this.dictionary.quantities[word] ?? null
    }

    isConjunction(word: string): boolean {
        return this.dictionary.conjunctions.includes(word)
    }

    isTerminator(word: string): boolean {
        return this.dictionary.terminators.includes(word)
    }

    getAllWords(): string[] {
        return this.wordList
    }

    isToken(word: string): boolean {
        return this.wordList.includes(word)
    }
}