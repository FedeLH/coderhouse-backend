import { messageManager } from "../daos/db/message.mongo.dao.js"

const chatController = (io,socket) =>{
    socket.on('message', async data => {
        try {
            data = {...data, message: data.message.toString()}
            await messageManager.addMessage(data)
            const messages = await messageManager.getMessages()
            io.emit('messageLogs', messages)
        } catch (error) {
            socket.emit('error', error)
        }
    })

    socket.on('newUser', async newUser => {
        try {
            const messages = await messageManager.getMessages()
            io.emit('messageLogs', messages)
            socket.broadcast.emit('newUser', newUser)
        } catch (error) {
            socket.emit('error', error)
        }
    })
}

export default chatController