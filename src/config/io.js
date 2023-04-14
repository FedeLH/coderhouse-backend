import { Server } from 'socket.io'
import { productManager } from '../Daos/ProductDaos/productManager.js'
import chatController from "../controllers/chat.controller.js";

const createIoServer = (httpServer) => {
    const io = new Server(httpServer)
    
    io.on('connection', socket => {
        console.log('Nuevo cliente conectado')

        socket.on('delete-product', async (productId) => {
            const response = await productManager.deleteProduct(Number(productId))
            const allProducts = await productManager.getProducts()
            const activeProducts = allProducts.filter(element => element.status)
            io.emit('update-products',activeProducts)
        })

        chatController(io,socket)
    })

    return io
}

export default createIoServer
