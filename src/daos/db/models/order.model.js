import { Schema, model } from "mongoose";

const orderCollection = 'orders'

const orderSchema = new Schema({
    code: {
        type: String
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    products: [{
        type: Schema.Types.ObjectId,
        ref: 'products'
    }],
    amount: Number,
    purchase_datetime: Date
})

export const orderModel = model(orderCollection, orderSchema)