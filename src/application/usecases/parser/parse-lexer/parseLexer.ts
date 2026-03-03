import type Token from "../../../../domain/parser/token.ts"
import type DictionaryPort from "../../../../ports/dictionary.port.ts"
import BaseUsecase from "../../../base/baseUsecase.ts"

class ParseLexer implements BaseUsecase {
    constructor(
        private readonly dictionary: DictionaryPort
    ) {}

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
            .flatMap<Token | null>(word => {
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

                const allWords = this.dictionary.getAllWords()
                const tokenIndex = allWords
                    .findIndex(dWord => word.includes(dWord))

                if (tokenIndex >= 0 && allWords[tokenIndex].length >= (word.length - word.length / 2)) {
                    if (tokenIndex < (word.length - allWords[tokenIndex].length) / 2) {
                        return this.parseTokens([
                            allWords[tokenIndex],
                            word.replaceAll(allWords[tokenIndex], "")
                        ])
                    } else {
                        return this.parseTokens([
                            word.replaceAll(allWords[tokenIndex], ""),
                            allWords[tokenIndex]
                        ])
                    }
                }

                else if (/^[0-9]+$/.test(word)) {
                    return {
                        type: "quantity",
                        value: parseFloat(word),
                        word
                    }
                }

                else if (/\d/.test(word)) {
                    return this.parseTokens([
                        word.replaceAll(/\D/g, ""),
                        word.replaceAll(/\d/g, "")
                    ])
                }

                return null
            })
            .filter(Boolean)
    }

    execute(input: string): Token[] {
        const words = this.getWords(input),
            output = this.parseTokens(words)
            
        return output
    }
}

export default ParseLexer