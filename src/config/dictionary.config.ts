import { readFile } from "fs/promises"
import path from "path"
import type Dictionary from "../domain/dictionary.ts"

export default async function loadDictionary(): Promise<Dictionary> {
    const dictionary = await readFile(
        path.resolve(
            path.dirname(""),
            "config",
            process.env.CONFIG_FOLDER,
            "dictionary.sandwich.json"
        )
    )

    return JSON.parse(
        dictionary.toString()
    )
}