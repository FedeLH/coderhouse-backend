import { connect } from "mongoose";
import { DB_HOST } from "./config/config.js";
import { logger } from "./utils/logger.js"

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
            logger.info('Connected')
            return this.#instance
        }
        this.#instance = new MongoSingleton()
        logger.info('Connected')

        return this.#instance
    }
}

export { MongoSingleton }