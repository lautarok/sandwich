import ExpressAdapter from "../../adapters/http/inbound/express.ts"
import BaileysAdapter from "../../adapters/whatsapp/inbound/baileys.ts"
import Dictionary from "../../adapters/dictionary/outbound/dictionary.ts"
import ProductRules from "../../adapters/productRules/outbound/productRules.ts"
import ParseLexer from "../../application/usecases/parser/parse-lexer/parseLexer.ts"
import ParseSemantic from "../../application/usecases/parser/parse-semantic/parseSemantic.ts"
import ParseSyntax from "../../application/usecases/parser/parse-syntax/parseSyntax.ts"
import loadDictionary from "../../config/dictionary.config.ts"
import loadProductRules from "../../config/productRules.config.ts"
import { CreateCustomer } from "../../application/usecases/customers/create-customer/createCustomer.ts"
import CustomerRepository from "../../adapters/mysql/outbound/repositories/customer.repository.ts"
import MysqlAdapter from "../../adapters/mysql/mysql.ts"
import GetCustomerList from "../../application/usecases/customers/get-customer-list/getCustomerList.ts"
import CustomerContactRepository from "../../adapters/mysql/outbound/repositories/customerContact.repository.ts"
import CreateCustomerContact from "../../application/usecases/customer-contacts/create-customer-contact/createCustomerContact.ts"
import GetCustomerContactList from "../../application/usecases/customer-contacts/get-customer-contact-list/getCustomerContactList.ts"

const dictionaryConfig = await loadDictionary(),
    productRulesConfig = await loadProductRules()

const dictionary = new Dictionary(dictionaryConfig),
    productRules = new ProductRules(productRulesConfig)

const mysqlAdapter = new MysqlAdapter

const customerRepository = new CustomerRepository({
    adapter: mysqlAdapter
})

const customerContactRepository = new CustomerContactRepository({
    adapter: mysqlAdapter
})

const parseLexer = new ParseLexer({
    dictionary
})

const parseSyntax = new ParseSyntax

const parseSemantic = new ParseSemantic({
    productRules
})

const createCustomer = new CreateCustomer({
    customerRepository
})

const getCustomerList = new GetCustomerList({
    customerRepository
})

const createCustomerContact = new CreateCustomerContact({
    customerContactRepository
})

const getCustomerContactList = new GetCustomerContactList({
    customerContactRepository
})

const expressAdapter = new ExpressAdapter({
    parseLexer,
    parseSyntax,
    parseSemantic,
    createCustomer,
    getCustomerList,
    createCustomerContact,
    getCustomerContactList
})

// new BaileysAdapter({
//     parseLexer, parseSyntax, parseSemantic
// })

try {
    const port = process.env.HTTP_PORT || 80

    await expressAdapter.run(port)
    console.log(`Server is listening on port ${port}`)
} catch (error) {
    throw error
}