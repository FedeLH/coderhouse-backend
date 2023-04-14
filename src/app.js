import express from 'express'
import { router } from './routes/index.js'
import __dirname from './utils/utils.js'
import path from 'path'
import handlerbars from 'express-handlebars'
import { firstItem } from './config/helper.js'

const app = express()

app.engine('handlebars', handlerbars.engine({helpers: {firstItem: firstItem}}))
app.set('view engine', 'handlebars')
app.set('views',path.dirname(__dirname)+'/views')

app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use(express.static(path.dirname(__dirname)+'/public'))

app.use(router)

export default app