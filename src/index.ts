import ExpressAdapter from "./adapters/http/inbound/express.ts"
import BaileysAdapter from "./adapters/whatsapp/inbound/baileys.ts"
import Dictionary from "./adapters/dictionary/outbound/dictionary.ts"
import ProductRules from "./adapters/productRules/outbound/productRules.ts"
import ParseLexer from "./usecases/parser/parse-lexer/parseLexer.ts"
import ParseSemantic from "./usecases/parser/parse-semantic/parseSemantic.ts"
import ParseSyntax from "./usecases/parser/parse-syntax/parseSyntax.ts"
import loadDictionary from "./config/dictionary.config.ts"
import loadProductRules from "./config/productRules.config.ts"

const dictionaryConfig = await loadDictionary(),
    productRulesConfig = await loadProductRules()

const dictionary = new Dictionary(dictionaryConfig),
    productRules = new ProductRules(productRulesConfig)

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