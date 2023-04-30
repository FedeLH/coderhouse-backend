import { connect } from "mongoose";
import { DB_HOST, DB_OPTIONS } from "./config.js";

const objConfig = {
  connectDB: async (_) => {
    try {
      await connect(DB_HOST, DB_OPTIONS);
      console.log("Connect to database");
    } catch (error) {
      console.log(error);
    }
  },
  url: DB_HOST,
};

export default objConfig;
