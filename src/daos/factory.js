import commander from '../utils/commander.js'
import { MongoSingleton } from '../MongoSingleton.js'
import CartDaoMongo from './db/cart.mongo.dao.js'
import MessageDaoMongo from './db/message.mongo.dao.js'
import OrderDaoMongo from './db/message.mongo.dao.js'
import ProductDaoMongo from './db/product.mongo.dao.js'
import UserDaoMongo from './db/product.mongo.dao.js'

const { persistence } = commander

let CartDao
let MessageDao
let OrderDao
let ProductDao
let UserDao

const configPersistence = {
    MONGO: () => {
        CartDao = CartDaoMongo
        MessageDao = MessageDaoMongo
        OrderDao = OrderDaoMongo
        ProductDao = ProductDaoMongo
        UserDao = UserDaoMongo
        return 'Persistence selected is MONGO'
    },
    FILE: () => {
        return 'This persistence is not implemented'
    },
    MEMORY: () => {
        return 'This persistence is not implemented'
    }
}
const persistenceUndefined = 'This persistence is not defined'

const configuredPersistence = configPersistence[persistence] ? configPersistence[persistence]() : persistenceUndefined

console.log(configuredPersistence)

const cartDao = new CartDao()
const messageDao = new MessageDao()
const orderDao = new OrderDao()
const productDao = new ProductDao()
const userDao = new UserDao()

export { cartDao, messageDao, orderDao, productDao, userDao }