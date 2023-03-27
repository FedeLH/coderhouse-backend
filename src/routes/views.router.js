import express from 'express'
import { productManager } from '../Daos/ProductDaos/productManager.js'

const router = express.Router()

router.get('/', async (req,res)=>{
    const allProducts = await productManager.getProducts()
    const activeProducts = allProducts.filter(element => element.status)

    res.render('index',{
        title: 'Fed-Tech',
        style: 'index.css',
        products: activeProducts
    })
})

router.get('/realTimeProducts', async (req,res)=>{
    const allProducts = await productManager.getProducts()
    const activeProducts = allProducts.filter(element => element.status)

    res.render('realTimeProducts',{
        title: 'Fed-Tech',
        style: 'realTimeProducts.css',
        products: activeProducts
    })
})

export default router