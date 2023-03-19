import multer from 'multer'
import __dirname from './utils.js'
import path from 'path'
console.log(path.dirname(__dirname))
const storage = multer.diskStorage({
    destination: (req,file,cb) => {
        cb(null,path.dirname(__dirname)+'\\public\\uploads')
    },
    filename: (req,file,cb) => {
        cb(null,Date.now() + file.originalname)
    }
})

export const uploader = multer({storage})