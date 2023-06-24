import multer from "multer";
import __dirname from "./utils.js";
import path from "path";
import { logger } from "../utils/logger.js"

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.dirname(__dirname) + "\\public\\uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now().toString().substring(6) + "-" + file.originalname);
  },
});

export const uploader = multer({
  storage,
  onError: (error, next) => {
    logger.error(error);
    next();
  },
});
