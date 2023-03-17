import fs from 'fs'

class ProductManager {

    #path
    constructor(path) {
        this.#path = path
    }
    
    #productValidator = (product,flag=0) => {
        const keysRequired = ['title','description','price','category','code','stock']
        const allKeys = [...keysRequired, 'status', 'thumbnails']
        if(flag) {
            for (let i = 0; i < keysRequired.length; i++) {
                const key = keysRequired[i];
                if (!product.hasOwnProperty(key)) {
                    throw new Error(`${key} is required.`)
                } 
            }
        }

        const array = Object.keys(product)
        for (let i = 0; i < array.length; i++) {
            const key = array[i]
            if ((key === 'price' || key === 'stock') && isNaN(product[key])) {
                throw new Error(`The property '${key}' not is Number.`)
            }
            if (!allKeys.includes(key)) {
                throw new Error(`Cannot change or add this key: ${key}.`)
            } 
        }

        product = {...product, price: Number(product.price), stock: Number(product.stock)}

        if (isNaN(product.price)) delete product.price
        if (isNaN(product.stock)) delete product.stock

        return product
    }

    addProduct = async product => {
        try {
            let productValid = this.#productValidator(product,true)
            const products = await this.getProducts()
            if(products.length !== 0 && products.some(element => element.code === productValid.code)) {
                throw new Error('This product code already exists')                
            } else {
                let lastElement = products[products.length-1]
                let newId = lastElement.id + 1
                let status = productValid.status ? productValid.status : true
                let thumbnails = productValid.thumbnails ? productValid.thumbnails : ['https://placehold.co/300x200']
                let newProduct = {id: newId, ...productValid, status, thumbnails }
                products.push(newProduct)
                await fs.promises.writeFile(this.#path,`${JSON.stringify(products,null,2)}`)
                return {message:'Product add succesfully.'}
            }
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
            let changesValid = this.#productValidator(changes)
            let products = await this.getProducts()
            
            if(!(products.length !== 0 && products.some(product => product.id === id))) throw new Error('This product id not exists')
            
            const index = products.findIndex(product => product.id === id)
            products[index] = {...products[index],...changesValid}
          
            await fs.promises.writeFile(this.#path,`${JSON.stringify(products,null,2)}`)
            return {message: 'Product update succesfully.'}
           
        } catch (error) {
            return {status: 400, message: error.message}
        }
        
    }
    
    deleteProduct = async id => {
        try {
            let changes = {status: false}
            let array = await this.getProducts()
            
            if(!(array.length !== 0 && array.some(element => (element.id === id && element.status)))) throw new Error('This product id not exists')
            
            for (let i = 0; i < array.length; i++) {
                const element = array[i];
                if(element.id === id) {
                    array[i].status = changes.status
                }
            }
            await fs.promises.writeFile(this.#path,`${JSON.stringify(array,null,2)}`)
            return {message: 'Product delete succesfully.'}
        } catch (error) {
            return {status: 400, message: error.message}
        }
    }
}

const productManager = new ProductManager('./src/Products.json')

export {ProductManager, productManager}