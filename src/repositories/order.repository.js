import { Repository } from "./repository.js"

class OrderRepository extends Repository{
    constructor(dao){
        super(dao)
    }
}

export { OrderRepository }
