import { describe, it } from "node:test"
import Dictionary from "./dictionary.ts"
import { strictEqual } from "node:assert"

describe("Dictionary", () => {
    const dictionary = new Dictionary({
        products: {
            "product": "product value"
        },
        features: {
            "feature": "feature value"
        },
        quantities: {
            "quantity": 1
        },
        conjunctions: ["conjunction"],
        terminators: ["terminator"]
    })

    it("Get product", () => {
        strictEqual(dictionary.getProduct("product"), "product value")
    })

    it("Get feature", () => {
        strictEqual(dictionary.getFeature("feature"), "feature value")
    })

    it("Get quantity", () => {
        strictEqual(dictionary.getQuantity("quantity"), 1)
    })

    it("Verify conjunction", () => {
        strictEqual(dictionary.isConjunction("conjunction"), true)
    })

    it("Verify terminator", () => {
        strictEqual(dictionary.isTerminator("terminator"), true)
    })

    it("Verify tokens", () => {
        strictEqual(dictionary.isToken("product"), true)
        strictEqual(dictionary.isToken("feature"), true)
        strictEqual(dictionary.isToken("quantity"), true)
        strictEqual(dictionary.isToken("conjunction"), true)
        strictEqual(dictionary.isToken("terminator"), true)
    })

    it("Initialize", () => {
        
    })
})