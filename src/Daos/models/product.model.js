import { Schema, model } from "mongoose"

const productCollection = 'products'

const productSchema = new Schema({

    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    stock: {
        type: Number,
        required: true
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    category: String,
    status: {
        type: Boolean,
        default: true
    },
    thumbnails: {
        type: [String],
        default: ["https://placehold.co/300x200"]
    }
})

export const productModel = model(productCollection,productSchema)
