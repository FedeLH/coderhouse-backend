class Repository {
    constructor(dao){
        this.dao = dao
    }

    async getOrders(){
        return await this.dao.get()
    }
    async getOrder(oid){
        return await this.dao.getById(oid)
    }
    async createOrder(){
        return await this.dao.create()
    }
    async deleteOrder(oid){
        return await this.dao.delete(oid)
    }
}

export { Repository }