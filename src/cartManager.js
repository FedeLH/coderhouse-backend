import fs from 'fs'
import { productManager } from './productManager.js'

class CartManager {
    
    #path
    constructor(path) {
        this.#path = path
    }

    #isValid = async (id) => {
        const products = await productManager.getProducts()
        return products.some(product => (product.id === id && product.status))
    }

    #saveCarts = async (carts) => {
        await fs.promises.writeFile(this.#path,`${JSON.stringify(carts,null,2)}`)
    } 

    getCarts = async _ => {
        try {
            if(!(fs.existsSync(this.#path))) return []

            let carts = await fs.promises.readFile(this.#path,'utf-8')
            if (!(carts.length !== 0 && carts !== '[]')) return []
            carts = JSON.parse(carts)
            return carts
        } catch (error) {
            return {status: 500, message: error.message}
        }
    }

    getProductsByCartId = async id => {
        try {
            const array = await this.getCarts()
            if (array.length === 0) throw new Error('Not found')
            
            const filteredCart = array.filter(cart => cart.id === id)
            if (filteredCart == '') throw new Error('Not found')

            return filteredCart[0].products ?? []
        } catch (error) {
            return {status: 404, message: error.message}
        }
    }

    addProductByCartId = async (cartId,productId,quantify=1) => {
        try {
            if(!(await this.#isValid(productId))) throw new Error('Invalid product ID')
            const carts = await this.getCarts()

            let cart = carts.find(cart => cart.id === cartId)
            if(!cart) throw new Error('Invalid cart ID')
            
            let index = cart.products.findIndex(product => product.id === productId)           
            if(index === -1) {
                cart.products.push({id:productId,quantify})
            }else {
                cart.products[index].quantify += quantify
            }

            this.#saveCarts(carts)
            return {message:'Product add succesfully.'}
        } catch (error) {
            return {status: 400, message: error.message}
        }
    }

    addCart = async () => {
        try {
            let cart = {products: []}
            const carts = await this.getCarts()

            let lastElement = carts[carts.length-1]
            let newId = lastElement.id + 1
            let newCart = {id: newId, ...cart}
            carts.push(newCart)

            this.#saveCarts(carts)
            return {message:'Cart add succesfully.'}
        } catch (error) {
            return {status: 400, message: error.message}
        }
    }
}

const cartManager = new CartManager('./src/Carts.json')

export {CartManager, cartManager}