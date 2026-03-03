import type ProductRule from "../domain/parser/productRule.ts";

export default interface ProductRulesPort {
    getProductRules(product: string, features: string[]): ProductRule | null,
    getDefaultProduct(): string
}