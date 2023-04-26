import { Schema, model } from "mongoose"
import mongoosePaginate from "mongoose-paginate-v2"

const userCollection = 'users'

const userSchema = new Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true,
        index: true
    },
    gender: String,
    status: {
        type: Boolean,
        default: true
    },
})

userSchema.plugin(mongoosePaginate)

export const productModel = model(userCollection,userSchema)
