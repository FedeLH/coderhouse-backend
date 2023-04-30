import { Router } from 'express'
import productsRouter from './products.router.js'
import cartsRouter from './carts.router.js'
import viewsRouter from './views.router.js'
import imagesRouter from './images.router.js'
import sessionsRouter from './sessions.router.js'

export const router = Router()

router.use('/api/images',imagesRouter)
router.use('/api/products',productsRouter)
router.use('/api/carts',cartsRouter)
router.use('/api/sessions', sessionsRouter)
router.use('/',viewsRouter)
