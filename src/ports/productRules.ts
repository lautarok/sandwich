import type ProductRule from "../domain/productRule.ts";

export default interface ProductRulesPort {
    getProductRules(product: string): ProductRule | null
}