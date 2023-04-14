import { cartModel } from '../models/cart.model.js'

class CartManager {

    getCarts = async _ => {
        return await cartModel.find()
    }

    addCart = async _ => {
        return await cartModel.create({})
    }

    getProductsByCartId = async cid => {
        return await cartModel.find({_id: cid})
    }

    deleteCart = async cid => {
        return await cartModel.deleteOne({_id: cid})
    }

    addProductByCartId = async (cid,products) => {
        return await cartModel.updateOne({_id: cid},{products: products})
    }
}

const cartManager = new CartManager()
export { cartManager, CartManager }
