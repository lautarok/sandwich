import type ProductRulesPort from "../../../ports/productRules.ts";
import type ProductRuleType from "../../../domain/productRule.ts"
import loadProductRules from "../../../config/productRules.config.ts";

export default class ProductRules implements ProductRulesPort {
    rules: Record<string, ProductRuleType>

    constructor(rules: Record<string, ProductRuleType>) {
        this.rules = rules
    }

    static async initialize() {
        const productRules = await loadProductRules()
        return new ProductRules(productRules)
    }

    getProductRules(product: string) {
        const matchRules = this.rules[product]
        if (!matchRules) return null
        return matchRules
    }
}