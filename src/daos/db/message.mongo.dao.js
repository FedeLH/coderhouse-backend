import { messageModel } from "./models/message.model.js";

class MessageDaoMongo {
  getMessages = async (_) => {
    return await messageModel.find();
  };

  addMessage = async (message) => {
    return await messageModel.create(message);
  };

  updateMessage = async (mid, changes) => {
    return await messageModel.updateOne({ _id: mid }, changes);
  };

  getMessageById = async (mid) => {
    return await messageModel.find({ _id: mid });
  };

  deleteMessage = async (mid) => {
    return await messageModel.deleteOne({ _id: mid });
  };
}

export default MessageDaoMongo;
