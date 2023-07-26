import multer from "multer";
import __dirname from "./utils.js";
import path from "path";
import { logger } from "../utils/logger.js"

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const folder = req.body.type ?? 'tmp'
    const destinationPath = path.join(path.dirname(__dirname), `public/uploads/${folder}`)
    cb(null, destinationPath);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now()
    const filename = file.originalname
    cb(null, `${timestamp}-${filename}`);
  },
});

export const uploader = multer({
  storage,
  onError: (error, next) => {
    logger.error(error);
    next();
  },
});
