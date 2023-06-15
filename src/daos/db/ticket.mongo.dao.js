import { ticketModel } from './models/ticket.model.js';

class TicketDaoMongo {
    constructor(){
        this.ticketModel = ticketModel
    }
    async get(){
        return await this.ticketModel.find({})
    }
    async getById(oid){
        return await this.ticketModel.findOne({_id: oid})
    }
    async create(ticket){
        return await this.ticketModel.create(ticket)
    }
}

export default TicketDaoMongo