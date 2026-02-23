import test, { describe, it } from "node:test"
import ParseLexer from "./parseLexer.ts"
import Dictionary from "../../adapters/dictionary/outbound/dictionary.ts"
import { deepEqual } from "node:assert/strict"

describe("parse lexer usecase", () => {
    const createMock = () => {
        const dictionary = new Dictionary({
            products: {
                "test": "test-value",
                "test with spaces": "test with spaces value",
                "mayus test": "mayus test value"
            },
            features: {
                "test feature": "test feature value"
            },
            quantities: {
                "two": 2
            },
            conjunctions: ["and"],
            terminators: ["."]
        })

        return new ParseLexer({
            dictionary
        })
    }

    const parseLexer = createMock()

    it("identify product from word", () => {
        const lexerResult = parseLexer.execute("test")

        deepEqual(lexerResult, [{
            type: "product",
            value: "test-value",
            word: "test"
        }])
    })

    it("identify product from capitalized word", () => {
        const lexerResult = parseLexer.execute("Mayus Test")

        deepEqual(lexerResult, [{
            type: "product",
            value: "mayus test value",
            word: "mayus test"
        }])
    })

    it("identify product from word with spaces", () => {
        const lexerResult = parseLexer.execute("test with spaces")

        deepEqual(lexerResult, [{
            type: "product",
            value: "test with spaces value",
            word: "test with spaces"
        }])
    })

    it("identify only feature", () => {
        const lexerResult = parseLexer.execute("test feature")

        deepEqual(lexerResult, [{
            type: "feature",
            value: "test feature value",
            word: "test feature"
        }])
    })

    it("identify product and feature", () => {
        const lexerResult = parseLexer.execute("test test feature")

        deepEqual(lexerResult, [
            {
                type: "product",
                value: "test-value",
                word: "test"
            },
            {
                type: "feature",
                value: "test feature value",
                word: "test feature"
            }
        ])
    })

    it("identify conjunction", () => {
        const lexerResult = parseLexer.execute("and")

        deepEqual(lexerResult, [{
            type: "conjunction",
            word: "and"
        }])
    })

    it("identify conjunction, feature and product", () => {
        const lexerResult = parseLexer.execute("test and test feature")

        deepEqual(lexerResult, [
            {
                type: "product",
                value: "test-value",
                word: "test"
            },
            {
                type: "conjunction",
                word: "and"
            },
            {
                type: "feature",
                value: "test feature value",
                word: "test feature"
            }
        ])
    })

    it("identify quantities", () => {
        const lexerResult = parseLexer.execute("1 two")

        deepEqual(lexerResult, [
            {
                type: "quantity",
                value: 1,
                word: "1"
            },
            {
                type: "quantity",
                value: 2,
                word: "two"
            }
        ])
    })

    it("identify quantities", () => {
        const lexerResult = parseLexer.execute("1 two")

        deepEqual(lexerResult, [
            {
                type: "quantity",
                value: 1,
                word: "1"
            },
            {
                type: "quantity",
                value: 2,
                word: "two"
            }
        ])
    })

    it("identify quantities, product and features", () => {
        const lexerResult = parseLexer.execute("two test test feature")

        deepEqual(lexerResult, [
            {
                type: "quantity",
                value: 2,
                word: "two"
            },
            {
                type: "product",
                value: "test-value",
                word: "test"
            },
            {
                type: "feature",
                value: "test feature value",
                word: "test feature"
            }
        ])
    })

    it("identify terminator", () => {
        const lexerResult = parseLexer.execute(".")

        deepEqual(lexerResult, [
            {
                type: "terminator",
                word: "."
            }
        ])
    })

    it("simulate order in lexer", () => {
        const lexerResult = parseLexer.execute("two of test with test feature and test.")

        deepEqual(lexerResult, [
            {
                type: "quantity",
                value: 2,
                word: "two"
            },
            {
                type: "product",
                value: "test-value",
                word: "test"
            },
            {
                type: "feature",
                value: "test feature value",
                word: "test feature"
            },
            {
                type: "conjunction",
                word: "and"
            },
            {
                type: "product",
                value: "test-value",
                word: "test"
            },
            {
                type: "terminator",
                word: "."
            }
        ])
    })
})