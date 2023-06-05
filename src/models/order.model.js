import { Schema, model } from "mongoose";

const orderCollection = 'orders'

const orderSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    products: [{
        type: Schema.Types.ObjectId,
        ref: 'products'
    }],
    total: Number,
    created: Date
})

export const orderModel = model(orderCollection, orderSchema)