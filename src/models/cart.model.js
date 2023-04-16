import { Schema, model } from "mongoose"

const cartCollection = 'carts'

const cartSchema = new Schema({
    products: [{
        product_id: {
            type: Schema.Types.ObjectId,
            ref: 'products'
        },
        quantify: {
            type: Number,
            default: 1
        }
    }]
})

cartSchema.pre('find', function() {
    this.populate('products.product_id')
})

export const cartModel = model(cartCollection,cartSchema)
