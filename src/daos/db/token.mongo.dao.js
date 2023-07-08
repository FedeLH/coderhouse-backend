import { tokenModel } from "./models/token.model.js"

class TokenDaoMongo {
    constructor(){
        this.tokenModel = tokenModel
    }
    async create(token){
        return await this.tokenModel.create(token)
    }
    async getByUserId(uid){
        return await this.tokenModel.find({user: uid})
    }
    async getByToken(token){
        return await this.tokenModel.findOne({token})
    }
    async delete(id){
        return await this.tokenModel.deleteOne({_id: id})
    }
}

export default TokenDaoMongo