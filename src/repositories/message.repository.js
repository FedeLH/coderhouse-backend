import { Repository } from "./repository.js"

class MessageRepository extends Repository{
    constructor(dao){
        super(dao)
    }
}

export { MessageRepository }
