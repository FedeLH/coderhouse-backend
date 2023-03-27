import express from 'express'
import productsRouter from './routes/products.router.js'
import cartsRouter from './routes/carts.router.js'
import __dirname from './utils/utils.js'
import path from 'path'
import handlerbars from 'express-handlebars'
import viewsRouter from './routes/views.router.js'

const app = express()

app.engine('handlebars', handlerbars.engine())
app.set('view engine', 'handlebars')
app.set('views',path.dirname(__dirname)+'/views')

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use(express.static(path.dirname(__dirname)+'/public'))

app.use('/api/products',productsRouter)
app.use('/api/carts',cartsRouter)
app.use('/',viewsRouter)

export default app