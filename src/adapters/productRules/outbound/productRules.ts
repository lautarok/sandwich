import type ProductRulesPort from "../../../ports/productRules.ts"
import type ProductRuleType from "../../../domain/productRule.ts"

export default class ProductRules implements ProductRulesPort {
    rules: Record<string, ProductRuleType>

    constructor(rules: Record<string, ProductRuleType>) {
        this.rules = rules
    }

    getProductRules(product: string) {
        const matchRules = this.rules[product]
        if (!matchRules) return null
        return matchRules
    }
}