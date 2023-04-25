import * as dotenv from 'dotenv'
dotenv.config()

export const SERVER_URL = process.env.SERVER_URL || 'http://localhost'
export const PORT = process.env.PORT || 8080
export const DB_HOST = process.env.DB_HOST || 'mongodb://localhost:27017/ecommerce'
export const DB_AUTO_INDEX= Boolean(process.env.DB_AUTO_INDEX) || false
export const DB_BUFFER_COMMANDS= Boolean(process.env.DB_BUFFER_COMMANDS) || false
export const DB_OPTIONS = {autoIndex: DB_AUTO_INDEX, bufferCommands: DB_BUFFER_COMMANDS}
