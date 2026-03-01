import { readFile } from "fs/promises"
import path from "path"
import type ProductRule from "../domain/parser/productRule.ts"

export default async function loadProductRules(): Promise<Record<string, ProductRule>> {
    const dictionary = await readFile(
        path.resolve(
            path.dirname(""),
            "config",
            process.env.CONFIG_FOLDER,
            "product-rules.sandwich.json"
        )
    )

    return JSON.parse(
        dictionary.toString()
    )
}