import { server } from './config/server.js'
import './config/io.js'
import * as dotenv from 'dotenv'
import objConfig from './config/db.js'

dotenv.config()
objConfig.connectDB()

const PORT = process.env.PORT || 8080

server.listen(PORT, error => {
    if (error) console.log(error)
    console.log(`Server up in port: ${PORT}`)
})    
