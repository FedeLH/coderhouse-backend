import { Router } from 'express'
import { productManager } from '../productManager.js'

const router = Router()

router.get('/',async (req,res) =>{
    const allProducts = await productManager.getProducts()
    const activeProducts = allProducts.filter(element => element.status)
    const limit = req.query.limit
    let limitedProducts = []
    if (limit) limitedProducts = activeProducts.slice(0,limit)
    res.status(activeProducts.status ? activeProducts.status : 200)
       .json({status: activeProducts.status ? 'error'         : 'success', 
             payload: limit                 ? limitedProducts : activeProducts})
})

router.get('/:pid',async (req,res) =>{
    const id = Number(req.params.pid)
    const product = await productManager.getProductById(id)
    let activeProduct = {
        "status": 404,
        "message": 'Product is disabled'
    }
    if(product[0].status) activeProduct = product
    res.status(activeProduct.status ? activeProduct.status : 200)
       .json({status: activeProduct.status ? 'error' : 'success', 
             payload: activeProduct})
})

router.post('/', async (req,res) => {
    const product = req.body
    const response = await productManager.addProduct(product)
    res.status(response.status ? response.status : 201)
       .json({status: response.status ? 'error' : 'success', 
             payload: response})
})

router.put('/:pid',async (req,res) =>{
    const id = Number(req.params.pid)
    const changes = req.body
    const response = await productManager.updateProduct(id,changes)
    res.status(response.status ? response.status : 201)
       .json({status: response.status ? 'error' : 'success', 
             payload: response})
})

router.delete('/:pid',async (req,res) =>{
    const id = Number(req.params.pid)
    const response = await productManager.deleteProduct(id)
    res.status(response.status ? response.status : 200)
       .json({status: response.status ? 'error' : 'success', 
             payload: response})
})

export default router
