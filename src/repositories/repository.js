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
    async createItem(item){
        return await this.dao.create(item)
    }
    async deleteItem(id){
        return await this.dao.delete(id)
    }
    async updateItem(id){
        return await this.dao.update(id)
    }
}

export { Repository }
