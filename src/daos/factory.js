import { MongoSingleton } from '../MongoSingleton.js'

let OrderDao
let ProductDao

switch ("MONGO") {
    case "FILE":
        const ProductManager = require('./json/product.json.dao')
        ProductDao = ProductManager
        break;
    default:
        MongoSingleton.getInstance()
        const OrderDaoMongo = require('./db/order.mongo.dao.js')
        OrderDao = OrderDaoMongo
        const ProductManager = require('./db/product.mongo.dao.js')
        ProductDao = ProductManager
        break;
}

export { OrderDao, ProductDao }