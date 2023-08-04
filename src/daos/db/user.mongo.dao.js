import { userModel } from "./models/user.model.js";

class UserDaoMongo {
  getUsers = async (filter, spec) => {
    return await userModel.paginate(filter, spec);
  };

  addUser = async (user) => {
    return await userModel.create(user);
  };

  updateUser = async (uid, changes) => {
    console.log({uid,changes})
    return await userModel.updateOne({ _id: uid }, changes);
  };

  getUserById = async (uid) => {
    return await userModel.find({ _id: uid });
  };

  deleteUser = async (pid) => {
    return await userModel.updateOne({ _id: uid }, { status: false });
  };

  getUsersGenders = async (_) => {
    return await userModel.distinct("gender");
  };

  getUserByEmail = async (email) => {
    return await userModel.find({ email });
  };
}

export default UserDaoMongo
