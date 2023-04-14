import { Router } from "express"
import { cartManager } from "../daos/cartDaos/mongoDBCart.dao.js"

const router = Router()

router.get('/', async (req,res) => {
    try {
        const allCarts = await cartManager.getCarts()
        const limit = req.query.limit
        let limitedCarts = []
        if (limit) limitedCarts = allCarts.slice(0,limit)
        res.status(200)
           .json({status: 'success',
                 payload: limit ? limitedCarts : allCarts})
    } catch (error) {
        res.status(404)
           .json({status: 'error', 
                 payload: error})
    }
})

router.post('/', async (req,res) => {
    try {     
        const response = await cartManager.addCart()
        res.status(201)
           .json({status: 'success',
                 payload: response})
    } catch (error) {
        res.status(404)
           .json({status: 'error', 
                 payload: error})
    }
})

router.get('/:cid', async (req,res) => {
    try {
        const id = req.params.cid
        const cart = await cartManager.getProductsByCartId(id)
        const products = cart[0].products ?? []
        res.status(200)
           .json({status: 'success',
                 payload: products})
    } catch (error) {
        res.status(404)
           .json({status: 'error', 
                 payload: error})
    }
})

router.post('/:cid/product/:pid', async (req,res) => {
    try {     
        const cid = req.params.cid
        const pid = req.params.pid
        let cart = await cartManager.getProductsByCartId(cid)
        let products = cart[0].products ?? []
        let encontrado = false
        for (let i = 0; i < products.length; i++) {
            const product = products[i]
            if (product._id.toString() === pid) { 
                product.quantify += 1
                encontrado = true
                break
            }
        }
        if(!encontrado) products = [...products, {_id: pid, quantify: 1}]
        const response = await cartManager.addProductByCartId(cid,products)
        res.status(201)
           .json({status: 'success',
                 payload: response})
    } catch (error) {
        res.status(404)
           .json({status: 'error', 
                 payload: error})
    }
})

export default router