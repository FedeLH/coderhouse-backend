import { connect } from "mongoose";
import { DB_HOST, DB_OPTIONS } from "./config.js";
import { logger } from '../utils/logger.js'
const objConfig = {
  connectDB: async (_) => {
    try {
      await connect(DB_HOST, DB_OPTIONS);
      logger.info("Connect to database");
    } catch (error) {
      logger.error(error);
    }
  },
  url: DB_HOST,
};

export default objConfig;
