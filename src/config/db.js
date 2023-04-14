import * as dotenv from 'dotenv'
import { connect } from 'mongoose'

dotenv.config()

const DB_HOST = process.env.DB_HOST || 'mongodb://localhost:27017/ecommerce'
const DB_AUTO_INDEX= Boolean(process.env.DB_AUTO_INDEX) || false
const DB_BUFFER_COMMANDS= Boolean(process.env.DB_BUFFER_COMMANDS) || false
const DB_OPTIONS = {autoIndex: DB_AUTO_INDEX, bufferCommands: DB_BUFFER_COMMANDS}

const objConfig = {
    connectDB: async _ => {
        try {
            await connect(DB_HOST,DB_OPTIONS)
            console.log('Connect to database')
        } catch (error) {
            console.log(error)
        }
    }
}

export default objConfig