import type Order from "../../../domain/order.ts"
import type OrderItem from "../../../domain/orderItem.ts"
import type OrderSyntax from "../../../domain/orderSyntax.ts"
import type OrderSyntaxBlock from "../../../domain/orderSyntaxBlock.ts"
import type ProductRulesPort from "../../../ports/productRules.ts"
import BaseUsecase from "../../baseUsecase.ts"

interface deps {
    productRules: ProductRulesPort
}

export default class ParseSemantic implements BaseUsecase<Order> {
    private productRules: ProductRulesPort

    constructor(deps: deps) {
        this.productRules = deps.productRules
    }

    private blockToItems(blocks: OrderSyntaxBlock[]): OrderItem[] {
        let output: OrderItem[] = []

        for (let i = 0; i < blocks.length; i++) {
            const currentBlock = blocks[i],
                rules = this.productRules.getProductRules(currentBlock.product)

            if (!rules) continue

            if (!rules.features?.includes(currentBlock.features[0])) {
                currentBlock.features = [rules.default]
            }

            if (currentBlock.quantities.length === 0) {
                currentBlock.quantities.push(1)
            }

            currentBlock.quantities.forEach((quantity, index) => {
                currentBlock.quantities[index] = quantity
            })

            if (rules.multiplicator) {
                currentBlock.quantities.forEach((quantity, index) => {
                    currentBlock.quantities[index] = quantity * rules.multiplicator
                })
            }

            currentBlock.features.forEach((feature, index) => {
                if (!rules.features.includes(feature)) {
                    currentBlock.features[index] = rules.default
                }
            })

            if (
                currentBlock.quantities.length === 2
            ) {
                const alternate = rules.alternate
                if (currentBlock.quantities[0] === currentBlock.quantities[1] && alternate) {
                    let alternateIndex = alternate.findIndex(a => {
                        a === currentBlock.features[0]
                    })
                    if (alternateIndex < 0) {
                        alternateIndex = 0
                    }

                    currentBlock.quantities.forEach((quantity, index) => {
                        output.push({
                            quantity,
                            product: currentBlock.product,
                            feature: alternate[(alternateIndex + index) % alternate.length]
                        })
                    })
                } else {
                    output.push({
                        quantity: currentBlock.quantities.reduce((a, b) => a + b),
                        product: currentBlock.product,
                        feature: currentBlock.features[0]
                    })
                }

                continue
            }

            if (currentBlock.features.length > 1) {
                const quantity = currentBlock.quantities[0] / (currentBlock.features.length)

                if (!rules.quantityStep || quantity % rules.quantityStep === 0) {
                    currentBlock.features.forEach(feature => {
                        output.push({
                            quantity,
                            feature,
                            product: currentBlock.product
                        })
                    })
                }

                continue
            }

            output.push({
                quantity: currentBlock.quantities[0],
                product: currentBlock.product,
                feature: currentBlock.features[0]
            })
        }

        return output.reduce<OrderItem[]>((acc, curr) => {
            const matchIndex = acc.findIndex(item =>
                item.product + item.feature === curr.product + curr.feature
            )

            if (matchIndex >= 0) {
                acc[matchIndex].quantity += curr.quantity
            } else {
                acc.push(curr)
            }

            return acc
        }, [])
    }

    execute(syntax: OrderSyntax) {
        const date = new Date()
        return {
            date,
            customer: "Mayra centro",
            items: this.blockToItems(syntax.blocks)
        }
    }
}