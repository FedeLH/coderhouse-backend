class Repository {
    constructor(dao){
        this.dao = dao
    }

    async getItems(){
        return await this.dao.get()
    }
    async getItem(id){
        return await this.dao.getById(id)
    }
    async createItem(){
        return await this.dao.create()
    }
    async deleteItem(id){
        return await this.dao.delete(id)
    }
}

export { Repository }
