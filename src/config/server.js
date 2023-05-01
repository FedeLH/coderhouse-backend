import http from "http";
import app from "../app.js";
import createIoServer from "./io.js";

export const server = http.createServer(app);
export const io = createIoServer(server);
