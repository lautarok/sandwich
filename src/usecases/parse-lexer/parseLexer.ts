import type Token from "../../domain/token.ts"
import type DictionaryPort from "../../ports/dictionary.ts"
import BaseUsecase from "../baseUsecase.ts"

interface deps {
    dictionary: DictionaryPort
}

class ParseLexer implements BaseUsecase<Token[]> {
    private dictionary: DictionaryPort

    constructor(deps: deps) {
        this.dictionary = deps.dictionary
    }

    private getWords(input: string): string[] {
        let words = input.toLowerCase()
            .split("\n")
            .join(" \n ")
            .split(".")
            .join(" . ")
            .split(",")
            .join(" , ")


        this.dictionary.getAllWords().forEach(word => {
            if (!word.includes(" ")) return
            words = words.replaceAll(word, word.replaceAll(" ", "%20"))
        })
        
        return words.split(" ")
    }

    private parseTokens(words: string[]): Token[] {
        return words
            .map<Token | null>(word => {
                word = word.replaceAll("%20", " ")

                const matchProduct = this.dictionary.getProduct(word)
                if (matchProduct) {
                    return {
                        type: "product",
                        value: matchProduct,
                        word
                    }
                }

                const matchFeature = this.dictionary.getFeature(word)
                if (matchFeature) {
                    return {
                        type: "feature",
                        value: matchFeature,
                        word
                    }
                }

                const matchQuantity = this.dictionary.getQuantity(word)
                if (matchQuantity) {
                    return {
                        type: "quantity",
                        value: matchQuantity,
                        word
                    }
                }

                const matchConjunction = this.dictionary.isConjunction(word)
                if (matchConjunction) {
                    return {
                        type: "conjunction",
                        word
                    }
                }

                const matchTerminator = this.dictionary.isTerminator(word)
                if (matchTerminator) {
                    return {
                        type: "terminator",
                        word
                    }
                }
                
                if (/^[0-9]+$/.test(word)) {
                    return {
                        type: "quantity",
                        value: parseFloat(word),
                        word
                    }
                }

                return null
            }).filter(Boolean)
    }

    execute(input: string): Token[] {
        const words = this.getWords(input),
            output = this.parseTokens(words)
            
        return output
    }
}

export default ParseLexer