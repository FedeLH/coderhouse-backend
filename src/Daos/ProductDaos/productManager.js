import fs from 'fs'

class ProductManager {

    #path
    #keysRequired
    #allKeys
    constructor(path) {
        this.#path = path
        this.#keysRequired = ['title','description','price','category','code','stock']
        this.#allKeys = [...this.#keysRequired, 'status', 'thumbnails']
    }

    #addProductValidator = (product) => {
        for (let i = 0; i < this.#keysRequired.length; i++) {
            const key = this.#keysRequired[i];
            if (!product.hasOwnProperty(key)) {
                throw new Error(`${key} is required.`)
            } 
        }
        
        return this.#updateProductValidator(product)
    }

    #updateProductValidator = (product) => {
        for (const propiedad in product) {
            if (product[propiedad] === undefined) {
              delete product[propiedad];
            }
        }
        const keysProduct = Object.keys(product)
        for (let i = 0; i < keysProduct.length; i++) {
            const key = keysProduct[i]
            if ((key === 'price' || key === 'stock') && isNaN(product[key])) {
                throw new Error(`The property '${key}' not is Number.`)
            }
            if (!this.#allKeys.includes(key)) {
                throw new Error(`Cannot change or add this key: ${key}.`)
            } 
        }

        product = {...product, price: Number(product.price), stock: Number(product.stock)}

        if (isNaN(product.price)) delete product.price
        if (isNaN(product.stock)) delete product.stock

        return product
    }

    #saveProducts = async (products) => {
        await fs.promises.writeFile(this.#path,`${JSON.stringify(products,null,2)}`)
    }

    addProduct = async product => {
        try {
            let productValid = this.#addProductValidator(product)
            const products = await this.getProducts()

            const { length } = products
            const isProduct = products.some(product => product.code === productValid.code)
            if(length && isProduct) throw new Error('This product code already exists')                
       
            let lastProduct = products[products.length-1] ?? 0
            let newId = lastProduct.id ? lastProduct.id + 1 : 1
            let status = productValid.status ?? true
            let thumbnails = productValid.thumbnails ?? ['https://placehold.co/300x200']
            let newProduct = {id: newId, ...productValid, status, thumbnails }
            products.push(newProduct)
            await this.#saveProducts(products)
            return {message:'Product add succesfully.', product: newProduct}
            
        } catch (error) {
            return {status: 400, message: error.message}
        }
    }
    
    getProducts = async _ => {
        try {
            if(!(fs.existsSync(this.#path))) return []

            let products = await fs.promises.readFile(this.#path,'utf-8')
            if (!(products.length !== 0 && products !== '[]')) return []
            products = JSON.parse(products)
            return products
        } catch (error) {
            return {status: 500, message: error.message}
        }
        
    }
    
    getProductById = async (id) => {
        try {
            const array = await this.getProducts()
            if (array.length === 0) throw new Error('Not found')
            
            const filteredProduct = array.filter(product => product.id === id)
            if (filteredProduct == '') throw new Error('Not found')

            return filteredProduct
        } catch (error) {
            return {status: 404, message: error.message}
        }
    }
    
    updateProduct = async (id,changes) => {
        try {
            let changesValid = this.#updateProductValidator(changes)
            let products = await this.getProducts()

            const { length } = products
            const isProduct = products.some(product => (product.id === id))
            if(!(length && isProduct)) throw new Error('Invalid product ID')
            
            const index = products.findIndex(product => product.id === id)
            products[index] = {...products[index],...changesValid}
          
            await this.#saveProducts(products)
            return {message: 'Product update succesfully.', product: products[index]}
           
        } catch (error) {
            return {status: 400, message: error.message}
        }
        
    }
    
    deleteProduct = async id => {
        try {
            let changes = {status: false}
            let products = await this.getProducts()
            
            const { length } = products
            const isProduct = products.some(product => (product.id === id && product.status))
            if(!(length && isProduct)) throw new Error('Invalid product ID')
            
            for (let i = 0; i < products.length; i++) {
                const element = products[i]
                if(element.id === id) {
                    products[i].status = changes.status
                }
            }
            await this.#saveProducts(products)
            return {message: 'Product delete succesfully.'}
        } catch (error) {
            return {status: 400, message: error.message}
        }
    }
}

const productManager = new ProductManager('./src/dbJson/Products.json')

export {ProductManager, productManager}