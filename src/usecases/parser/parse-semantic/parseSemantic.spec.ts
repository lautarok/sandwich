import { describe, it } from "node:test"
import ParseSemantic from "./parseSemantic.ts"
import ProductRules from "../../../adapters/productRules/outbound/productRules.ts"
import { partialDeepStrictEqual } from "node:assert/strict"

describe("parse semantic usecase", () => {
    const createMock = () => {
        const productRules = new ProductRules({
            "product": {
                alternate: [
                    "feature one",
                    "feature two"
                ],
                quantityStep: 1,
                features: [
                    "feature one",
                    "feature two"
                ]
            },
            "product two": {
                default: "feature three",
                multiplicator: 5,
                quantityStep: 4,
                features: [
                    "feature three",
                ]
            },
            "product three": {
                features: [
                    "feature four",
                    "feature five"
                ]
            }
        })

        return new ParseSemantic({
            productRules
        })
    }

    const parseSemantic = createMock()

    it("omit invalid product", () => {
        const semanticResult = parseSemantic.execute({
            blocks: [
                {
                    product: "invalid product",
                    quantities: [],
                    features: []
                }
            ]
        })

        partialDeepStrictEqual(semanticResult, {
            items: []
        })
    })

    it("omit invalid features", () => {
        const semanticResult = parseSemantic.execute({
            blocks: [
                {
                    product: "product",
                    features: ["feature three"],
                    quantities: [1]
                }
            ]
        })

        partialDeepStrictEqual(semanticResult, {
            items: [
                {
                    feature: undefined
                }
            ]
        })
    })

    it("auto set quantity value if not exists", () => {
        const semanticResult = parseSemantic.execute({
            blocks: [
                {
                    product: "product",
                    quantities: [],
                    features: []
                }
            ]
        })

        partialDeepStrictEqual(semanticResult, {
            items: [
                {
                    quantity: 1
                }
            ]
        })
    })

    it("apply multiplicator rule", () => {
        const semanticResult = parseSemantic.execute({
            blocks: [
                {
                    product: "product two",
                    quantities: [3],
                    features: []
                },
                {
                    product: "product",
                    quantities: [],
                    features: []
                }
            ]
        })

        partialDeepStrictEqual(semanticResult, {
            items: [
                {
                    quantity: 15
                },
                {
                    quantity: 1
                }
            ]
        })
    })

    it("auto set default feature if not exists", () => {
        const semanticResult = parseSemantic.execute({
            blocks: [
                {
                    product: "product two",
                    quantities: [3],
                    features: []
                }
            ]
        })

        partialDeepStrictEqual(semanticResult, {
            items: [
                {
                    feature: "feature three"
                }
            ]
        })
    })

    it("split two quantities and alternate our features", () => {
        const semanticResult = parseSemantic.execute({
            blocks: [
                {
                    product: "product",
                    quantities: [1, 1],
                    features: []
                }
            ]
        })

        partialDeepStrictEqual(semanticResult, {
            items: [
                {
                    feature: "feature one"
                },
                {
                    feature: "feature two"
                }
            ]
        })
    })

    it("merge two quantities to one item", () => {
        const semanticResult = parseSemantic.execute({
            blocks: [
                {
                    product: "product two",
                    quantities: [1, 1],
                    features: []
                }
            ]
        })

        partialDeepStrictEqual(semanticResult, {
            items: [
                {
                    quantity: 10
                }
            ]
        })
    })

    it("merge two quantities to one item", () => {
        const semanticResult = parseSemantic.execute({
            blocks: [
                {
                    product: "product two",
                    quantities: [1, 1],
                    features: []
                }
            ]
        })

        partialDeepStrictEqual(semanticResult, {
            items: [
                {
                    quantity: 10
                }
            ]
        })
    })

    it("apply two ordered features", () => {
        const semanticResult = parseSemantic.execute({
            blocks: [
                {
                    product: "product",
                    quantities: [250],
                    features: ["feature two", "feature one"]
                }
            ]
        })

        partialDeepStrictEqual(semanticResult, {
            items: [
                {
                    feature: "feature two"
                },
                {
                    feature: "feature one"
                }
            ]
        })
    })

    it("order product without default feature", () => {
        const semanticResult = parseSemantic.execute({
            blocks: [
                {
                    product: "product",
                    quantities: [1],
                    features: []
                }
            ]
        })

        partialDeepStrictEqual(semanticResult, {
            items: [
                {
                    product: "product",
                    quantity: 1,
                    feature: undefined
                }
            ]
        })
    })

    it("merge equal orders with different quantities", () => {
        const semanticResult = parseSemantic.execute({
            blocks: [
                {
                    product: "product",
                    quantities: [1, 2],
                    features: ["feature one"]
                },
                {
                    product: "product",
                    quantities: [3, 4],
                    features: ["feature one"]
                }
            ]
        })

        partialDeepStrictEqual(semanticResult, {
            items: [
                {
                    product: "product",
                    quantity: 10,
                    feature: "feature one"
                }
            ]
        })
    })

    it("merge order quantities without alternate rules", () => {
        const semanticResult = parseSemantic.execute({
            blocks: [
                {
                    product: "product two",
                    quantities: [1, 1],
                    features: []
                }
            ]
        })

        partialDeepStrictEqual(semanticResult, {
            items: [
                {
                    product: "product two",
                    quantity: 10,
                    feature: "feature three"
                }
            ]
        })
    })

    it("omit item with invalid quantity on split by feature", () => {
        const semanticResult = parseSemantic.execute({
            blocks: [
                {
                    product: "product",
                    quantities: [1],
                    features: ["feature one", "feature two"]
                }
            ]
        })

        partialDeepStrictEqual(semanticResult, {
            items: []
        })
    })

    it("split quantities in a product without min quantity rule", () => {
        const semanticResult = parseSemantic.execute({
            blocks: [
                {
                    product: "product three",
                    quantities: [1],
                    features: ["feature four", "feature five"]
                }
            ]
        })

        partialDeepStrictEqual(semanticResult, {
            items: [
                {
                    quantity: 0.5
                },
                {
                    quantity: 0.5
                }
            ]
        })
    })
})