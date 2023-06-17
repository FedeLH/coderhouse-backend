class MongoDao {
    constructor(model){
        this.model = model
    }
    async get(filter){
        return await this.model.find(filter)
    }
    async getById(id){
        return await this.model.find({ _id: id }).lean()
    }
    async create(item){
        return await this.model.create(item)
    }
    async delete(id){
        return await this.model.deleteOne({ _id: id })
    }
    async update(id){
        return await this.model.updateOne({ _id: id })
    }
}

export { MongoDao }
