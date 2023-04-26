import { userModel } from '../../models/user.model.js'

class UserManager {
    getUsers = async (filter,spec) => {
        return await userModel.paginate(filter, spec)
    }

    addUser = async (user) => {
        return await userModel.create(user)
    }
    
    updateUser = async (uid,changes) => {
        return await userModel.updateOne({_id: uid},changes)
    }

    getUserById = async uid => {
        return await userModel.find({_id: uid})
    }

    deleteUser = async pid => {
        return await userModel.updateOne({_id: uid},{status: false})
    }
}

const userManager = new UserManager()
export { userManager, UserManager }