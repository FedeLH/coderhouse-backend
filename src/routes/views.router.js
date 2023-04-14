import express from 'express'
import { productManager } from '../daos/productDaos/mongoDBProduct.dao.js'

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

router.get('/chat', (req, res) => {
    res.render('chat',{title: 'Chat', style: '/chat.css'})
})


export default router