import ExpressAdapter from "./adapters/primary/http/express.ts"
import BaileysAdapter from "./adapters/primary/whatsapp/baileys.ts"
import Dictionary from "./adapters/secondary/dictionary/dictionary.ts"
import ProductRules from "./adapters/secondary/productRules/productRules.ts"
import ParseLexer from "./usecases/parse-lexer/parseLexer.ts"
import ParseSemantic from "./usecases/parse-semantic/parseSemantic.ts"
import ParseSyntax from "./usecases/parse-syntax/parseSyntax.ts"

const dictionary = await Dictionary.initialize(),
    productRules = await ProductRules.initialize()

const parseLexer = new ParseLexer({
    dictionary
})

const parseSyntax = new ParseSyntax

const parseSemantic = new ParseSemantic({
    productRules
})

const expressAdapter = new ExpressAdapter({
    parseLexer, parseSyntax, parseSemantic
})

new BaileysAdapter({
    parseLexer, parseSyntax, parseSemantic
})

try {
    const port = process.env.HTTP_PORT || 80

    await expressAdapter.run(port)
    console.log(`Server is listening on port ${port}`)
} catch (error) {
    throw error
}