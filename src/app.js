import express from 'express'
import ProductManager from './productManager.js'

const app = express()
const productManager = new ProductManager('./src/Products.json')
const PORT = 8080

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.get('/products',async (req,res) =>{
    const allProducts = await productManager.getProducts()
    const limit = req.query.limit
    if(allProducts.status) return res.status(product.status).send(`${JSON.stringify(product,null,2)}`)
    if (!limit) {
        res.send(`${JSON.stringify(allProducts,null,2)}`)
    } else {
        const limitedProducts = allProducts.slice(0,limit)
        res.send(`${JSON.stringify(limitedProducts,null,2)}`)
    }
})

app.get('/products/:pid',async (req,res) =>{
    const id = Number(req.params.pid)
    const product = await productManager.getProductById(id)
    if(product.status) return res.status(product.status).send(`${JSON.stringify(product,null,2)}`)
    res.send(`${JSON.stringify(product,null,2)}`)
})

app.listen(PORT,()=>console.log(`Server up in port: ${PORT}`))