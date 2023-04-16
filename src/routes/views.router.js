import express from 'express'
import { productManager } from '../daos/db/product.mongo.dao.js'

const router = express.Router()

router.get('/', async (req,res)=>{
    const { filter={}, limit = 10, page = 1 } = req.query
    const {docs, ...rest} = await productManager.getProducts({status: true}, limit, page)

    res.render('index',{
        title: 'Fed-Tech',
        style: 'index.css',
        products: docs,
        paginate: rest
    })
})

router.get('/realTimeProducts', async (req,res)=>{
    const { limit = 10, page = 1 } = req.query
    const {docs, ...rest} = await productManager.getProducts({status: true}, limit, page)

    res.render('realTimeProducts',{
        title: 'Fed-Tech',
        style: 'realTimeProducts.css',
        products: docs,
        paginate: rest
    })
})

router.get('/chat', (req, res) => {
    res.render('chat',{title: 'Chat', style: '/chat.css'})
})


export default router