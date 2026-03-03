import type ProductRulesPort from "../../../ports/productRules.port.ts"
import type ProductRuleType from "../../../domain/parser/productRule.ts"

export default class ProductRules implements ProductRulesPort {
    rules: Record<string, ProductRuleType>

    constructor(rules: Record<string, ProductRuleType>) {
        this.rules = rules
    }

    getProductRules(product: string, features?: string[]) {
        const matchRules = {...this.rules[product]}
        if (!matchRules) return null

        if (matchRules.price === undefined) {
            matchRules.price = 0
        }

        features?.forEach(feature => {
            const matchFeature = matchRules.features.find(f => f.name === feature)

            if (!matchFeature || !matchFeature.addPrice) {
                return
            }

            matchRules.price += matchFeature.addPrice
        })

        return matchRules
    }

    getDefaultProduct(): string {
        return Object.keys(this.rules)[0]
    }
}