import ExpressAdapter from "../../adapters/http/inbound/express.ts"
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
import CreateOrder from "../../application/usecases/orders/create-order/createOrder.ts"
import OrderRepository from "../../adapters/mysql/outbound/repositories/order.repository.ts"
import OrderItemRepository from "../../adapters/mysql/outbound/repositories/orderItem.repository.ts"
import GetOrderList from "../../application/usecases/orders/get-order-list/getOrderList.ts"

const dictionaryConfig = await loadDictionary(),
    productRulesConfig = await loadProductRules()

const dictionary = new Dictionary(dictionaryConfig),
    productRules = new ProductRules(productRulesConfig)

const mysqlAdapter = new MysqlAdapter

const customerRepository = new CustomerRepository(mysqlAdapter),
    customerContactRepository = new CustomerContactRepository(mysqlAdapter),
    orderRepository = new OrderRepository(mysqlAdapter),
    orderItemRepository = new OrderItemRepository(mysqlAdapter)

const parseLexer = new ParseLexer(dictionary),
    parseSyntax = new ParseSyntax,
    parseSemantic = new ParseSemantic(productRules),

    createCustomer = new CreateCustomer(customerRepository),
    getCustomerList = new GetCustomerList(customerRepository),

    createCustomerContact = new CreateCustomerContact(customerContactRepository),
    getCustomerContactList = new GetCustomerContactList(customerContactRepository),

    createOrder = new CreateOrder(
        mysqlAdapter,
        orderRepository,
        orderItemRepository
    ),
    getOrderList = new GetOrderList(orderRepository)

const expressAdapter = new ExpressAdapter(
    parseLexer,
    parseSyntax,
    parseSemantic,
    createCustomer,
    getCustomerList,
    createCustomerContact,
    getCustomerContactList,
    createOrder,
    getOrderList
)

try {
    const port = process.env.HTTP_PORT || 80

    await expressAdapter.run(port)
    console.log(`Server is listening on port ${port}`)
} catch (error) {
    throw error
}