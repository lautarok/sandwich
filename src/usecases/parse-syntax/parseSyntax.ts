import type OrderSyntax from "../../domain/orderSyntax.ts"
import type Token from "../../domain/token.ts"
import BaseUsecase from "../baseUsecase.ts"

export default class ParseSyntax implements BaseUsecase<OrderSyntax> {
    private createOrderBlock(tokenGroup: Token[]) {
        const product = tokenGroup.find(t => t.type === "product")?.value,
            quantities = [...tokenGroup.filter(t => t.type === "quantity")]
                .map(t => t.value),
            features = [...tokenGroup.filter(t => t.type === "feature")]
                .map(t => t.value)

        return {
            quantities,
            product,
            features
        }
    }

    private agroupTokens(tokens: Token[]): Token[][] {
        let tokenGroup: Token[][] = [[]]

        tokens.forEach((token, index) => {
            const tokenType = token.type,

                lastProduct = tokenGroup[tokenGroup.length-1]
                    .find(t => t.type === "product")?.value,

                lastQuantity = tokenGroup[tokenGroup.length-1]
                    .find(t => t.type === "quantity")?.value

            let nextProducts: Token[] = []
            for (let i = index; i < tokens.length; i++) {
                const nextToken = tokens[i]
                
                if (nextToken.type === "product") {
                    nextProducts.push(nextToken)
                } else if (
                    nextToken.type === "terminator"
                    || nextToken.type === "conjunction"
                ) {
                    break
                }
            }

            if (
                (lastProduct && lastQuantity && (
                    (
                        (
                            tokenType === "conjunction"
                            || tokenType === "quantity"
                        )
                        && nextProducts.length > 0
                    )
                )) || (
                    token.type === "terminator"
                    && lastProduct
                    && lastQuantity
                )
            ) {
                tokenGroup.push([])
            }

            tokenGroup[tokenGroup.length-1].push(token)
        })

        return tokenGroup
    }

    execute(tokens: Token[]): OrderSyntax {
        return {
            blocks: this.agroupTokens(tokens).map(tokenGroup => (
                this.createOrderBlock(tokenGroup)
            ))
        } as OrderSyntax
    }
}