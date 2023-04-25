import { productModel } from '../../models/product.model.js'

class ProductManager {

    getProducts = async (filter,spec) => {
        return await productModel.paginate(filter, spec)
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

    getProductsCategories = async _ => {
        return await productModel.distinct('category')
    }

}

const productManager = new ProductManager()
export { productManager, ProductManager }
