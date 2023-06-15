import { Schema, model } from "mongoose";

const ticketCollection = 'tickets'

const ticketSchema = new Schema({
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
    purchase_datetime: Date,
    purchaser: String
})

export const ticketModel = model(ticketCollection, ticketSchema)