import { messageDao } from "../daos/factory.js";

const chatController = (io, socket) => {
  socket.on("message", async (data) => {
    try {
      data = { ...data, message: data.message.toString() };
      await messageDao.addMessage(data);
      const messages = await messageDao.getMessages();
      io.emit("messageLogs", messages);
    } catch (error) {
      socket.emit("error", error);
    }
  });

  socket.on("newUser", async (newUser) => {
    try {
      const messages = await messageDao.getMessages();
      io.emit("messageLogs", messages);
      socket.broadcast.emit("newUser", newUser);
    } catch (error) {
      socket.emit("error", error);
    }
  });
};

export default chatController;
