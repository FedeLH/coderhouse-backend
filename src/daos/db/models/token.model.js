import { Schema, model } from "mongoose";

const tokenCollection = 'tokens'

const tokenSchema = new Schema({
    token: {
        type: String
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    expiration_date: Date
})

export const tokenModel = model(tokenCollection, tokenSchema)