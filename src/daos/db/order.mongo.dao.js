import { orderModel } from './models/order.model.js';

class OrderDaoMongo {
    constructor(){
        this.orderModel = orderModel
    }
    async get(){
        return await this.orderModel.find({})
    }
    async getById(oid){
        return await this.orderModel.findOne({_id: oid})
    }
    async create(){
        return await this.orderModel.create()
    }
}

export default OrderDaoMongo