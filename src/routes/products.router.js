import { Router } from 'express'
import { productManager } from '../daos/db/product.mongo.dao.js'
import __dirname from '../utils/utils.js'
import { io } from '../config/server.js'
import { productCreateSchema, productUpdateSchema } from '../validators/product.validator.js'
import validateObject from '../middlewares/validator.js'
import { SERVER_URL, PORT } from '../config/config.js'

const router = Router()

router.get('/',async (req,res) =>{
    try {
        const { limit = 10, page = 1, sort = null } = req.query
        const query = req.query.query ? JSON.parse(req.query.query) : {}
        const spec = sort ? { limit, page, sort: {price: sort}, lean: true} : {limit, page, lean: true}
        const response = await productManager.getProducts(query, spec)
        const currentPage = response.page
        const prevPage = response.prevPage
        const nextPage = response.nextPage

        res.status(200)
        .json({status: 'success', 
        payload: response.docs,
        totalPages: response.totalPages,
        prevPage: response.prevPage,
        nextPage: response.nextPage,
        page: currentPage,
        hasPrevPage: response.hasPrevPage,
        hasNextPage: response.hasNextPage,
        prevLink: prevPage ? `${SERVER_URL}:${PORT}/api/products?limit=${limit}&page=${prevPage}` : null,
        nextLink: nextPage ? `${SERVER_URL}:${PORT}/api/products?limit=${limit}&page=${nextPage}` : null})
} catch (error) {
        res.status(404)
           .json({status: 'error', 
                 payload: {error: error, message: error.message}})
    }
})

router.get('/:pid',async (req,res) =>{
    try {     
        const id = req.params.pid
        const product = await productManager.getProductById(id)
        res.status(200)
           .json({status: 'success', 
                 payload: product})
    } catch (error) {
        res.status(404)
           .json({status: 'error', 
                 payload: {error: error, message: error.message}})
    }
})

router.post('/', validateObject(productCreateSchema), async (req,res) => {
    try {
        const product = req.body
        const response = await productManager.addProduct(product)
        res.status(201)
           .json({status: 'success', 
                 payload: response})
        if (response.product) io.emit('add-new-product', response.product)
    } catch (error) {
        if (error.code === 11000) return res.status(400).json({status: 'error', payload: {error: error, message: error.message}.message})
        res.status(404)
           .json({status: 'error', 
                 payload: {error: error, message: error.message}})
    }
})

router.put('/:pid', validateObject(productUpdateSchema), async (req,res) =>{
    try {
        const id = req.params.pid
        const changes = req.body
        const response = await productManager.updateProduct(id,changes)
        res.status(201)
           .json({status: 'success', 
                 payload: response})
        if (response.product) io.emit('update-product', response.product)
    } catch (error) {
        res.status(404)
           .json({status: 'error', 
                 payload: {error: error, message: error.message}})
    }
})

router.delete('/:pid',async (req,res) =>{
    try {
        const id = req.params.pid
        const response = await productManager.deleteProduct(id)
        res.status(200)
           .json({status: 'success', 
                 payload: response})
    } catch (error) {
        res.status(404)
           .json({status: 'error', 
                 payload: {error: error, message: error.message}})
    }
})

export default router
