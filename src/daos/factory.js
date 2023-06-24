import commander from '../utils/commander.js'
import { MongoSingleton } from '../MongoSingleton.js'
import CartDaoMongo from './db/cart.mongo.dao.js'
import MessageDaoMongo from './db/message.mongo.dao.js'
import TicketDaoMongo from './db/ticket.mongo.dao.js'
import ProductDaoMongo from './db/product.mongo.dao.js'
import UserDaoMongo from './db/user.mongo.dao.js'
import { logger } from '../utils/logger.js'

const { persistence } = commander

let CartDao
let MessageDao
let TicketDao
let ProductDao
let UserDao

const configPersistence = {
    MONGO: () => {
        MongoSingleton.getInstance();
        CartDao = CartDaoMongo
        MessageDao = MessageDaoMongo
        TicketDao = TicketDaoMongo
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

logger.info(configuredPersistence)

const cartDao = new CartDao()
const messageDao = new MessageDao()
const ticketDao = new TicketDao()
const productDao = new ProductDao()
const userDao = new UserDao()

export { cartDao, messageDao, ticketDao, productDao, userDao }