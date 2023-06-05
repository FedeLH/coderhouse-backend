import { connect } from "mongoose";
import { DB_HOST } from "./config/config";

class MongoSingleton {
    static #instance
    constructor(){
        connect(DB_HOST, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
    }

    static getInstance(){
        if(this.#instance){
            console.log('Connected')
            return this.#instance
        }
        this.#instance = new MongoSingleton()
        console.log('Connected')

        return this.#instance
    }
}

export { MongoSingleton }