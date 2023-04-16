import { cartModel } from '../../models/cart.model.js'

class CartManager {

    getCarts = async (filter) => {
        return await cartModel.find(filter)
    }

    addCart = async _ => {
        return await cartModel.create({})
    }

    getCartById = async cid => {
        return await cartModel.find({_id: cid})
    }

    deleteCart = async cid => {
        return await cartModel.deleteOne({_id: cid})
    }

    addProductByCartId = async (cid,products) => {
        return await cartModel.updateOne({_id: cid},{products: products})
    }

    getProductsByCartId = async cid => {
        let cart = await this.getCartById(cid)
        return cart[0].products ?? []
    }

}

const cartManager = new CartManager()
export { cartManager, CartManager }
