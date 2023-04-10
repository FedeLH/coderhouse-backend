import { productModel } from '../models/product.model.js'

class ProductManager {

    getProducts = async _ => {
        return await productModel.find().lean()
    }

    addProduct = async (product) => {
        return await productModel.create(product)
    }
    
    updateProduct = async (pid,changes) => {
        return await productModel.updateOne({_id: pid},changes)
    }

    getProductById = async pid => {
        return await productModel.find({_id: pid})
    }

    deleteProduct = async pid => {
        return await productModel.updateOne({_id: pid},{status: false})
    }

}

const productManager = new ProductManager()
export { productManager, ProductManager }
