import { Router } from "express"
import { cartManager } from "../Daos/CartDaos/cartManager.js"

const router = Router()

router.get('/', async (req,res) => {
    const allCarts = await cartManager.getCarts()
    const limit = req.query.limit
    let limitedCarts = []
    if (limit) limitedCarts = allCarts.slice(0,limit)
    res.status(allCarts.status ? allCarts.status : 200)
       .json({status: allCarts.status ? 'error'      : 'success',
             payload: limit           ? limitedCarts : allCarts})
})

router.post('/', async (req,res) => {
    const response = await cartManager.addCart()
    res.status(response.status ? response.status : 201)
       .json({status: response.status ? 'error' : 'success',
             payload: response})
})

router.get('/:cid', async (req,res) => {
    const id = Number(req.params.cid)
    const products = await cartManager.getProductsByCartId(id)
    res.status(products.status ? products.status : 200)
       .json({status: products.status ? 'error' : 'success',
             payload: products})
})

router.post('/:cid/product/:pid', async (req,res) => {
    const cid = Number(req.params.cid)
    const pid = Number(req.params.pid)
    const response = await cartManager.addProductByCartId(cid,pid)
    res.status(response.status ? response.status : 201)
       .json({status: response.status ? 'error' : 'success',
             payload: response})
})

export default router