import { server } from './config/server.js'
import './config/io.js'
import objConfig from './config/db.js'
import { PORT, SERVER_URL } from './config/config.js'

objConfig.connectDB()

server.listen(PORT, error => {
    if (error) console.log(error)
    console.log(`Server up in port: ${PORT}`)
    console.log(`${SERVER_URL}:${PORT}`)
})    
