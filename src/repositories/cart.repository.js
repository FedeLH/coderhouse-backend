import { Repository } from "./repository.js"

class CartRepository extends Repository{
    constructor(dao){
        super(dao)
    }
}

export { CartRepository }