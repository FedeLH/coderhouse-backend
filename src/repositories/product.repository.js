import { Repository } from "./repository.js"

class ProductRepository extends Repository{
    constructor(dao){
        super(dao)
    }
}

export { ProductRepository }
