import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcrypt";

export const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const checkValidPassword = ({ hashedPassword, password }) =>
  bcrypt.compareSync(password, hashedPassword);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(path.dirname(__filename));

export default __dirname;
