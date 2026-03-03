import type Order from "../../../../domain/parser/order.ts"
import type OrderItem from "../../../../domain/parser/orderItem.ts"
import type OrderSyntax from "../../../../domain/parser/orderSyntax.ts"
import type OrderSyntaxBlock from "../../../../domain/parser/orderSyntaxBlock.ts"
import type ProductRulesPort from "../../../../ports/productRules.port.ts"
import BaseUsecase from "../../../base/baseUsecase.ts"

export default class ParseSemantic implements BaseUsecase {
    constructor(
        private readonly productRules: ProductRulesPort
    ) {}

    private blockToItems(blocks: OrderSyntaxBlock[]): OrderItem[] {
        let output: OrderItem[] = []

        for (let i = 0; i < blocks.length; i++) {
            const currentBlock = blocks[i],
                rules = this.productRules.getProductRules(
                    currentBlock.product, currentBlock.features
                )

            if (!rules) continue

            if (!rules.features?.map(f => f.name).includes(currentBlock.features[0])) {
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

            currentBlock.features?.forEach((feature, index) => {
                if (!rules.features.map(f => f.name).includes(feature)) {
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
                            feature: alternate[(alternateIndex + index) % alternate.length],
                            price: rules.price * quantity
                        })
                    })
                } else {
                    const quantity = currentBlock.quantities.reduce((a, b) => a + b)

                    output.push({
                        quantity,
                        product: currentBlock.product,
                        feature: currentBlock.features[0],
                        price: rules.price * quantity
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
                            product: currentBlock.product,
                            price: rules.price * quantity
                        })
                    })
                }

                continue
            }

            output.push({
                quantity: currentBlock.quantities[0],
                product: currentBlock.product,
                feature: currentBlock.features[0],
                price: rules.price * currentBlock.quantities[0]
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
        return {
            items: this.blockToItems(syntax.blocks)
        }
    }
}