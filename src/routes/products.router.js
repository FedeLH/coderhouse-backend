import { Router } from 'express'
import { productManager } from '../productManager.js'
import { uploader } from '../utils/multer.js'
import __dirname from '../utils/utils.js'

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

router.post('/', uploader.array('files'), async (req,res) => {
    if (req.files.length) {
        let thumbnails = []
        req.files.forEach(file => {
            file.filename += Date.now()
            let path = file.destination + '\\' + file.filename
            thumbnails.push(path)
        })
        const {title, description, price, stock, code, category} = req.body
        const product = {title, description, price, stock, code, category, thumbnails}
        const response = await productManager.addProduct(product)
        return res.status(response.status ? response.status : 201)
                  .json({status: response.status ? 'error' : 'success', 
                        payload: response})
    }
    const {title, description, price, stock, code, category} = req.body
    const product = {title, description, price, stock, code, category}
    const response = await productManager.addProduct(product)
    res.status(response.status ? response.status : 201)
       .json({status: response.status ? 'error' : 'success', 
             payload: response})
})

router.put('/:pid', uploader.array('files'), async (req,res) =>{
    const id = Number(req.params.pid)
    if (req.files.length) {
        let thumbnails = []
        req.files.forEach(file => {
            file.filename += Date.now()
            let path = file.destination + '\\' + file.filename
            thumbnails.push(path)
        })
        const {title, description, price, stock, code, status, category} = req.body
        const changes = {title, description, price, stock, code, category, status, thumbnails}
        const response = await productManager.updateProduct(id,changes)
        return res.status(response.status ? response.status : 201)
                  .json({status: response.status ? 'error' : 'success', 
                        payload: response})
    }
    const {title, description, price, stock, code, category, status} = req.body
    const changes = {title, description, price, stock, code, category, status}
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
