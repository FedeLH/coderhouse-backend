let productA = {
    title: "product prueba",
    description: "Este es un producto prueba",
    price: 200,
    thumbnail: "Sin imagen",
    code:"abc123",
    stock: 25
}

class ProductManager {
    #contador
    #products
    constructor() {
        this.#products = []
        this.#contador = 1
    }

    addProduct = (product) => {

        const keysValidator = ["title","description","price","thumbnail","code","stock"]
        for (let i = 0; i < keysValidator.length; i++) {
            const key = keysValidator[i];
            if (!product.hasOwnProperty(key)) {
                return console.error(`❌ ${key} is required.`);
            } 
        }

        if (this.#products.length === 0) {
            let newProduct = {id: this.#contador, ...product}
            this.#products.push(newProduct)
            this.#contador++
            return console.log("✔️  Product add succesfully.")
        }

        const array = this.#products
        if(array.some(element => element.code === product.code)) {
            return console.error("❌ This product code already exists")                
        } else {
            let newProduct = {id: this.#contador, ...product}
            this.#products.push(newProduct)
            this.#contador++
            return console.log("✔️  Product add succesfully.")
        }
    }

    getProducts = () => this.#products

    getProductById = (id) => {
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
}

//Se crea una instancia de la clase "ProductManager"
let productManager = new ProductManager()

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