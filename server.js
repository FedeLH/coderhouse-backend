import {server} from './src/config/server.js'
import './src/config/io.js'

const PORT = process.env.PORT || 8080

server.listen(PORT,()=>console.log(`Server up in port: ${PORT}`))