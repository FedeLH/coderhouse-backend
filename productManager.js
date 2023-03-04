const fs = require('fs')

class ProductManager {
    #contador
    #products
    #path
    constructor(path) {
        this.#path = path
        this.#products = this.#setVariables()[0]
        this.#contador = this.#setVariables()[1]
    }
    
    #setVariables = _ => {
        let products = []
        let contador = 1
        if(!(fs.existsSync(this.#path))) {
            fs.writeFileSync(this.#path,'')
        } else {
            let resultado = fs.readFileSync(this.#path,'utf-8')
            if (resultado.length !== 0 && resultado !== '[]') {
                products = JSON.parse(resultado)
                let lastElement = products[products.length-1]
                contador = lastElement.id + 1
                return [products,contador]
            }
        }
        return [products,contador]
    }
    
    addProduct = product => {
        
        const keysValidator = ["title","description","price","thumbnail","code","stock"]
        for (let i = 0; i < keysValidator.length; i++) {
            const key = keysValidator[i];
            if (!product.hasOwnProperty(key)) {
                return console.error(`❌ ${key} is required.`);
            } 
        }
        
        if(this.#products.length !== 0 && this.#products.some(element => element.code === product.code)) {
            return console.error("❌ This product code already exists")                
        } else {
            let newProduct = {id: this.#contador, ...product}
            this.#products.push(newProduct)
            fs.writeFileSync(this.#path,`${JSON.stringify(this.#products,null,2)}`)
            return console.log("✔️  Product add succesfully.")
        }
    }
    
    getProducts = _ => this.#products
    
    getProductById = id => {
        const array = this.#products
        if (array.length === 0) {return console.error("❌ Not found")}
        for (let i = 0; i < array.length; i++) {
            const element = array[i]
            if (element.id === id) {
                const {id, ...rest} = element
                return rest               
            } else {
                return console.error("❌ Not found")
            }
        }
    }
    
    updateProduct = (id,changes) => {
        let array = this.#products
        let array2 = Object.keys(changes)
        if(array.length !== 0 && array.some(element => element.id === id)) {
            for (let i = 0; i < array.length; i++) {
                const element = array[i];
                if(element.id === id) {
                    for (let j = 0; j < array2.length; j++) {
                        const element2 = array2[j];
                        array[i][element2] = changes[element2]
                    }
                }
            }
            fs.writeFileSync(this.#path,`${JSON.stringify(array,null,2)}`)
            return console.log("✔️  Product update succesfully.")
        } else {
            return console.error("❌ This product id not exists")                
        }
        
    }
    
    deleteProduct = id => {
        let array = this.#products
        if(array.length !== 0 && array.some(element => element.id === id)) {
            for (let i = 0; i < array.length; i++) {
                const element = array[i];
                if(element.id === id) {
                    array.splice(i,1)
                }
            }
            fs.writeFileSync(this.#path,`${JSON.stringify(array,null,2)}`)
            return console.log("✔️  Product deleted succesfully.")
        } else {
            return console.error("❌ This product id not exists")                
        }
    }
}

//Se definen productos para probar la solución

let productA = {
    title: "product prueba",
    description: "Este es un producto prueba",
    price: 200,
    thumbnail: "Sin imagen",
    code:"abc124",
    stock: 25
}

let productB = {
    description: "Aumento el precio porque mejoramos su calidad",
    price: 250
}

//Se ejecutan las pruebas

//Se crea una instancia de la clase "ProductManager"

let productManager = new ProductManager('./Products.json')

//Se llama al método "getProducts" el cual devolverá un arreglo vacío
console.log(productManager.getProducts())

//Se llama al método "addProduct" con los campos mencionados
productManager.addProduct(productA)

//Se llama al método "getProducts" nuevamente el cual devolverá el producto antes agregado
console.log(productManager.getProducts())

//Se llama al método "addProduct" nuevamente con los mismos campos, esto arrojará error por encontrarse repetido el "code"
productManager.addProduct(productA)

//Se llama al método "getProductById" con el id del producto generado, esto devolverá el producto
console.log(productManager.getProductById(1))

//Se llama al método "getProductById" con un id inexistente, esto devolverá error al no ser encontrado
productManager.getProductById(50)

//Se llama al método "updateProduct"
productManager.updateProduct(1,productB)

//Se llama al método "deleteProduct"
productManager.deleteProduct(1)