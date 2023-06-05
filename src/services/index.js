import { OrderDao } from '../daos/factory.js';

import OrderRepository from '../repositories/order.repository.js'

export const orderRepository = new OrderRepository(new OrderDao())