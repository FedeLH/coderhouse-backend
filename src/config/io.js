import { Server } from "socket.io";
import { productManager } from "../daos/json/product.json.dao.js";
import chatController from "../controllers/chat.controller.js";
import { logger } from '../utils/logger.js'

const createIoServer = (httpServer) => {
  const io = new Server(httpServer);

  io.on("connection", (socket) => {
    logger.info("Nuevo cliente conectado");

    socket.on("delete-product", async (productId) => {
      const response = await productManager.deleteProduct(Number(productId));
      const allProducts = await productManager.getProducts();
      const activeProducts = allProducts.filter((element) => element.status);
      io.emit("update-products", activeProducts);
    });

    chatController(io, socket);

    socket.on("disconnect", (socket) => {
      logger.info("Cliente desconectado");
    });
  });

  return io;
};

export default createIoServer;
