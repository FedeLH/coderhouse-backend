import { cartDao, messageDao, orderDao, productDao, userDao } from '../daos/factory.js';
import TicketRepository from '../repositories/ticket.repository.js'
import CartRepository from '../repositories/cart.repository.js'
import MessageRepository from '../repositories/message.repository.js'
import ProductRepository from '../repositories/product.repository.js'
import UserRepository from '../repositories/user.respository.js'

const ticketService = new TicketRepository(ticketDao)
const cartService = new CartRepository(cartDao)
const messageService = new MessageRepository(messageDao)
const productService = new ProductRepository(productDao)
const userService = new UserRepository(userDao)

export { ticketService, cartService, messageService, productService, userService }
