import { Schema, model } from "mongoose"

const cartCollection = 'carts'

const productSchema = new Schema({
    id: {
        type: String,
        required: true,
        unique: true
    },
    quantify: {
        type: Number,
        default: 1
    }
})

const cartSchema = new Schema({
    products: [productSchema]
})

export const cartModel = model(cartCollection,cartSchema)
