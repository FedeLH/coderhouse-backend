import { Router } from 'express'
//import { productManager } from '../Daos/ProductDaos/productManager.js'
import { productManager } from '../daos/productDaos/mongoDBProduct.dao.js'
//import { uploader } from '../utils/multer.js'
import __dirname from '../utils/utils.js'
import { io } from '../config/server.js'
import { productCreateSchema, productUpdateSchema } from '../validators/product.validator.js'
import validateObject from '../middlewares/validator.js'

const router = Router()

router.get('/',async (req,res) =>{
    try {     
        const allProducts = await productManager.getProducts()
        const activeProducts = allProducts.filter(element => element.status)
        const limit = req.query.limit
        let limitedProducts = []
        if (limit) limitedProducts = activeProducts.slice(0,limit)
        res.status(200)
           .json({status: 'success', 
                 payload: limit ? limitedProducts : activeProducts})
    } catch (error) {
        res.status(404)
           .json({status: 'error', 
                 payload: error})
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
                 payload: error})
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
        if (error.code === 11000) return res.status(400).json({status: 'error', payload: error.message})
        res.status(404)
           .json({status: 'error', 
                 payload: error})
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
                 payload: error})
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
                 payload: error})
    }
})

export default router
