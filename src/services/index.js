import { cartDao, messageDao, orderDao, productDao, userDao } from '../daos/factory.js';
import OrderRepository from '../repositories/order.repository.js'
import CartRepository from '../repositories/cart.repository.js'
import MessageRepository from '../repositories/message.repository.js'
import ProductRepository from '../repositories/product.repository.js'
import UserRepository from '../repositories/user.respository.js'

const orderService = new OrderRepository(orderDao)
const cartService = new CartRepository(cartDao)
const messageService = new MessageRepository(messageDao)
const productService = new ProductRepository(productDao)
const userService = new UserRepository(userDao)

export { orderService, cartService, messageService, productService, userService }
