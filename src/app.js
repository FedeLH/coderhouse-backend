import express from 'express'
import ProductManager from './productManager.js'

const app = express()
const productManager = new ProductManager('./src/Products.json')

app.use(express.urlencoded({extended:true}))

app.get('/products',async (req,res) =>{
    const allProducts = await productManager.getProducts()
    const limit = req.query.limit
    if (!limit) return res.send(`${JSON.stringify(allProducts,null,2)}`)
    const limitedProducts = allProducts.slice(0,limit)
    res.send(`${JSON.stringify(limitedProducts,null,2)}`)
    
})

app.get('/products/:pid',async (req,res) =>{
    const id = Number(req.params.pid)
    const product = await productManager.getProductById(id)
    res.send(`${JSON.stringify(product,null,2)}`)
})

app.listen(8080,()=>console.log("¡Servidor arriba en el puerto 8080!"))