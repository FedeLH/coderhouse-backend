import express from 'express'
import productsRouter from './routes/products.router.js'
import cartsRouter from './routes/carts.router.js'
import __dirname from './utils/utils.js'
import path from 'path'
import handlerbars from 'express-handlebars'
import {Server} from 'socket.io'
import viewsRouter from './routes/views.router.js'

const app = express()
const PORT = 8080
const httpServer = app.listen(PORT,()=>console.log(`Server up in port: ${PORT}`))
const io = new Server(httpServer)

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use('/api/products',productsRouter)
app.use('/api/carts',cartsRouter)
app.engine('handlebars', handlerbars.engine())
app.set('views',path.dirname(__dirname)+'/views')
app.set('view engine', 'handlebars')
app.use(express.static(path.dirname(__dirname)+'/public'))
app.use('/',viewsRouter)

io.on('connection', socket => {
    console.log('Nuevo cliente conectado');

    socket.on('message', data => {
        console.log(data)
    })
    socket.emit('evento_para_uno','Este mensaje solo lo recibira uno')
    socket.broadcast.emit('evento_para_todos_menos_uno','Este mensaje lo reciben todos menos uno')
    io.emit('evento_para_todos','Este mensaje lo reciben todos')
})