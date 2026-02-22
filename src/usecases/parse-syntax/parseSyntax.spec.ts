import { describe, it } from "node:test"
import ParseSyntax from "./parseSyntax.ts"
import { deepEqual } from "node:assert"

describe("parse syntax usecase", () => {
    const createMock = () => {
        return new ParseSyntax()
    }

    const parseSyntax = createMock()

    it("agroup using terminator, quantities and products", () => {
        const syntaxResult = parseSyntax.execute([
            {
                type: "product",
                value: "test"
            },
            {
                type: "quantity",
                value: 1
            },
            {
                type: "terminator"
            },
            {
                type: "quantity",
                value: 2
            },
            {
                type: "product",
                value: "test two"
            }
        ])

        deepEqual(syntaxResult, {
            blocks: [
                {
                    product: "test",
                    quantities: [1],
                    features: []
                },
                {
                    product: "test two",
                    quantities: [2],
                    features: []
                }
            ]
        })
    })

    it("agroup using quantities, products and conjunction", () => {
        const syntaxResult = parseSyntax.execute([
            {
                type: "product",
                value: "test"
            },
            {
                type: "quantity",
                value: 1
            },
            {
                type: "conjunction"
            },
            {
                type: "quantity",
                value: 2
            },
            {
                type: "product",
                value: "test two"
            }
        ])

        deepEqual(syntaxResult, {
            blocks: [
                {
                    product: "test",
                    quantities: [1],
                    features: []
                },
                {
                    product: "test two",
                    quantities: [2],
                    features: []
                }
            ]
        })
    })

    it("agroup splitting with product", () => {
        const syntaxResult = parseSyntax.execute([
            {
                type: "product",
                value: "test"
            },
            {
                type: "quantity",
                value: 1
            },
            {
                type: "product",
                value: "test two"
            },
            {
                type: "quantity",
                value: 2
            }
        ])

        deepEqual(syntaxResult, {
            blocks: [
                {
                    product: "test",
                    quantities: [1],
                    features: []
                },
                {
                    product: "test two",
                    quantities: [2],
                    features: []
                }
            ]
        })
    })

    it("agroup splitting with product", () => {
        const syntaxResult = parseSyntax.execute([
            {
                type: "product",
                value: "test"
            },
            {
                type: "quantity",
                value: 1
            },
            {
                type: "product",
                value: "test two"
            },
            {
                type: "quantity",
                value: 2
            }
        ])

        deepEqual(syntaxResult, {
            blocks: [
                {
                    product: "test",
                    quantities: [1],
                    features: []
                },
                {
                    product: "test two",
                    quantities: [2],
                    features: []
                }
            ]
        })
    })

    it("use multiple features", () => {
        const syntaxResult = parseSyntax.execute([
            {
                type: "product",
                value: "test"
            },
            {
                type: "quantity",
                value: 1
            },
            {
                type: "feature",
                value: "test feature"
            },
            {
                type: "feature",
                value: "test feature two"
            },
            {
                type: "product",
                value: "test two"
            },
            {
                type: "quantity",
                value: 2
            }
        ])

        deepEqual(syntaxResult, {
            blocks: [
                {
                    product: "test",
                    quantities: [1],
                    features: [
                        "test feature",
                        "test feature two"
                    ]
                },
                {
                    product: "test two",
                    quantities: [2],
                    features: []
                }
            ]
        })
    })

    it("use multiple features", () => {
        const syntaxResult = parseSyntax.execute([
            {
                type: "product",
                value: "test"
            },
            {
                type: "quantity",
                value: 1
            },
            {
                type: "feature",
                value: "test feature"
            },
            {
                type: "feature",
                value: "test feature two"
            },
            {
                type: "product",
                value: "test two"
            },
            {
                type: "quantity",
                value: 2
            }
        ])

        deepEqual(syntaxResult, {
            blocks: [
                {
                    product: "test",
                    quantities: [1],
                    features: [
                        "test feature",
                        "test feature two"
                    ]
                },
                {
                    product: "test two",
                    quantities: [2],
                    features: []
                }
            ]
        })
    })

    it("simulate basic order", () => {
        const syntaxResult = parseSyntax.execute([
            {
                type: "quantity",
                value: 1
            },
            {
                type: "product",
                value: "first product"
            },
            {
                type: "conjunction"
            },
            {
                type: "quantity",
                value: 3
            },
            {
                type: "product",
                value: "2nd product"
            },
            {
                type: "feature",
                value: "first feature"
            }
        ])

        deepEqual(syntaxResult, {
            blocks: [
                {
                    product: "first product",
                    quantities: [1],
                    features: []
                },
                {
                    product: "2nd product",
                    quantities: [3],
                    features: ["first feature"]
                }
            ]
        })
    })

    it("simulate complex order", () => {
        const syntaxResult = parseSyntax.execute([
            {
                type: "quantity",
                value: 1
            },
            {
                type: "conjunction"
            },
            {
                type: "quantity",
                value: 0.5
            },
            {
                type: "product",
                value: "first product"
            },
            {
                type: "feature",
                value: "first feature"
            },
            {
                type: "conjunction"
            },
            {
                type: "feature",
                value: "second feature"
            },
            {
                type: "terminator"
            },
            {
                type: "quantity",
                value: 10
            },
            {
                type: "product",
                value: "second product"
            }
        ])

        deepEqual(syntaxResult, {
            blocks: [
                {
                    product: "first product",
                    quantities: [1, 0.5],
                    features: ["first feature", "second feature"]
                },
                {
                    product: "second product",
                    quantities: [10],
                    features: []
                }
            ]
        })
    })
})