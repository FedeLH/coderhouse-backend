import fs from 'fs'

export default class ProductManager {

    #path
    constructor(path) {
        this.#path = path
    }
    
    #isValid = (product,flag=0) => {
        const keysValidator = ["title","description","price","thumbnail","code","stock"]
        if(flag) {
            for (let i = 0; i < keysValidator.length; i++) {
                const key = keysValidator[i];
                if (!product.hasOwnProperty(key)) {
                    throw new Error(`❌ ${key} is required.`);
                } 
            }
        }
        const array = Object.keys(product)
        for (let i = 0; i < array.length; i++) {
            const key = array[i]
            if (!keysValidator.includes(key)) {
                throw new Error(`❌ Cannot change or add this key: ${key}.`);
            } 
        }
    }

    addProduct = async product => {
        try {
            this.#isValid(product,true)
            const products = await this.getProducts()
            if(products.length !== 0 && products.some(element => element.code === product.code)) {
                throw new Error("❌ This product code already exists")                
            } else {
                let lastElement = products[products.length-1]
                let newId = lastElement.id + 1
                let newProduct = {id: newId, ...product}
                products.push(newProduct)
                await fs.promises.writeFile(this.#path,`${JSON.stringify(products,null,2)}`)
                return console.log("✔️  Product add succesfully.")
            }
        } catch (error) {
            return {Error: error.message}
        }

       
    
    }
    
    getProducts = async _ => {
        try {
            if(!(fs.existsSync(this.#path))) {
                return []
            } else {
                let products = await fs.promises.readFile(this.#path,'utf-8')
                if (products.length !== 0 && products !== '[]') {
                    products = JSON.parse(products)
                    return products
                } else {
                    return []
                }
            }
        } catch (error) {
            return {Error: error.message}
        }
        
    }
    
    getProductById = async id => {
        try {
            const array = await this.getProducts()
            if (array.length === 0) {throw new Error("❌ Not found")}
            
            const filteredProduct = array.filter(product => product.id === id)
            if (filteredProduct == '') {throw new Error("❌ Not found")}

            return filteredProduct
        } catch (error) {
            return {Error: error.message}
        }
    
    }
    
    updateProduct = async (id,changes) => {
        try {
            this.#isValid(changes)
            let array = await this.getProducts()
            let array2 = Object.keys(changes)
            if(array.length !== 0 && array.some(element => element.id === id)) {
                for (let i = 0; i < array.length; i++) {
                    const element = array[i];
                    if(element.id === id) {
                        for (let j = 0; j < array2.length; j++) {
                            const element2 = array2[j]
                            array[i][element2] = changes[element2]
                        }
                    }
                }
                await fs.promises.writeFile(this.#path,`${JSON.stringify(array,null,2)}`)
                return console.log("✔️  Product update succesfully.")
            } else {
                throw new Error("❌ This product id not exists")                
            }
        } catch (error) {
            return {Error: error.message}
        }
        
    }
    
    deleteProduct = async id => {
        try {
            let array = await this.getProducts()
            if(array.length !== 0 && array.some(element => element.id === id)) {
                for (let i = 0; i < array.length; i++) {
                    const element = array[i];
                    if(element.id === id) {
                        array.splice(i,1)
                    }
                }
                await fs.promises.writeFile(this.#path,`${JSON.stringify(array,null,2)}`)
                return console.log("✔️  Product deleted succesfully.")
            } else {
                throw new Error("❌ This product id not exists")                
            }
        } catch (error) {
            return {Error: error.message}
        }
        
    }
}

// Se definen productos para probar la solución

let productA = {
    title: "product prueba",
    description: "Este es un producto prueba",
    price: 200,
    thumbnail: "Sin imagen",
    code:"abc124",
    stock: 25
}

let productB = {
    id: 50,
    description: "Aumento el precio porque mejoramos su calidad",
    price: 250
}

// Se crea una instancia de la clase "ProductManager"

let productManager = new ProductManager('./src/Products.json')

const main = async _ => {
    
//     Se ejecutan las pruebas
    
//     Se prueba el método "getProducts"
//     console.log(await productManager.getProducts())
    
//     Se prueba el método "addProduct"
//     await productManager.addProduct(productA)
//     console.log(await productManager.getProducts())
//     await productManager.addProduct(productA)
//     console.log(await productManager.updateProduct(1,productB))
    
//     Se prueba el método "getProductById"
//     console.log(await productManager.getProductById(5))
//     await productManager.getProductById(50)
    
//     Se prueba el método "updateProduct"
//     console.log(await productManager.getProductsById(2))
//     await productManager.updateProduct(2,productB)
//     await productManager.updateProduct(6,productB)
//     console.log(await productManager.getProducts())
    
//     Se prueba el método "deleteProduct"
//     console.log(await productManager.getProducts())
//     await productManager.deleteProduct(4)
//     console.log(await productManager.getProducts())
}

main()
