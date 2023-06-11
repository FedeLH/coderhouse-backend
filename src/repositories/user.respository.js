import { Repository } from "./repository.js"

class UserRepository extends Repository{
    constructor(dao){
        super(dao)
    }
}

export { UserRepository }