import { userDao } from "../daos/factory.js";
import __dirname from "../utils/utils.js";
import { io } from "../config/server.js";
import { SERVER_URL, PORT } from "../config/config.js";

class UserController {
    getUsers = async (req, res) => {
        try {
          const { limit = 10, page = 1, sort = null } = req.query;
          const query = req.query.query ? JSON.parse(req.query.query) : {};
          const spec = sort
            ? { limit, page, sort: { price: sort }, lean: true }
            : { limit, page, lean: true };
          const response = await userDao.getUsers(query, spec);
          const currentPage = response.page;
          const prevPage = response.prevPage;
          const nextPage = response.nextPage;
      
          res.status(200).json({
            status: "success",
            payload: response.docs,
            totalPages: response.totalPages,
            prevPage: response.prevPage,
            nextPage: response.nextPage,
            page: currentPage,
            hasPrevPage: response.hasPrevPage,
            hasNextPage: response.hasNextPage,
            prevLink: prevPage
              ? `${SERVER_URL}:${PORT}/api/users?limit=${limit}&page=${prevPage}`
              : null,
            nextLink: nextPage
              ? `${SERVER_URL}:${PORT}/api/users?limit=${limit}&page=${nextPage}`
              : null,
          })
        } catch (error) {
          res.status(404).json({
            status: "error",
            payload: { error: error, message: error.message },
          });
        }
    }

    getUser = async (req, res) => {
        try {
          const id = req.params.uid;
          const user = await userDao.getUserById(id);
          res.status(200).json({ status: "success", payload: user });
        } catch (error) {
          res.status(404).json({
            status: "error",
            payload: { error: error, message: error.message },
          });
        }
    }

    addUser = async (req, res) => {
        try {
          const user = req.body;
          const response = await userDao.addUser(user);
          res.status(201).json({ status: "success", payload: response });
          if (response.user) io.emit("add-new-user", response.user);
        } catch (error) {
          if (error.code === 11000)
            return res.status(400).json({
              status: "error",
              payload: { error: error, message: error.message }.message,
            });
          res.status(404).json({
            status: "error",
            payload: { error: error, message: error.message },
          });
        }
    }

    updateUser = async (req, res) => {
        try {
          const id = req.params.uid;
          const changes = req.body;
          const response = await userDao.updateUser(id, changes);
          res.status(201).json({ status: "success", payload: response });
          if (response.user) io.emit("update-user", response.user);
        } catch (error) {
          res.status(404).json({
            status: "error",
            payload: { error: error, message: error.message },
          });
        }
    }

    deleteUser = async (req, res) => {
        try {
          const id = req.params.uid;
          const response = await userDao.deleteUser(id);
          res.status(200).json({ status: "success", payload: response });
        } catch (error) {
          res.status(404).json({
            status: "error",
            payload: { error: error, message: error.message },
          });
        }
    }

    changeRoleUser = async (req, res) => {
      try {
        const id = req.params.uid;
        let newRole = 'user'
        if (req.user[0].role === 'user') {
          const { documentation } = await getUserById(req.user[0]._id)
          const mandatoryDocumentation = ["Identificación","Comprobante de domicilio","Comprobante de estado de cuenta"]
          const actualDocumentation = documentation.map(obj => obj.name)
          const hasAllDocumentation = mandatoryDocumentation.every(nameDocumentation => actualDocumentation.includes(nameDocumentation))
          if (!hasAllDocumentation) throw new Error('You have not finished processing your documentation') 
          newRole = 'premium'
        }
        const changes = {
          role: newRole
        }
        await userDao.updateUser(id, changes);
        req.session.destroy((err) => {
          if (err) return res.send({ status: "Logout error", message: err });
          return res.status(307).redirect("/login");
        });
        res.status(201).json({ status: "success", payload: `Your new role is ${newRole} please login again` });
      } catch (error) {
        res.status(404).json({
          status: "error",
          payload: { error: error, message: error.message },
        });
      }
    }

    updateDocumentation = async (req, res) => {
      try {
        const id = req.params.uid;
        const files = req.files
        const documents = files.map(file => ({name: file.originalname.replace(/\.[^/.]+$/,""), reference: file.path.split('\\').slice(-3).join('\\')}))
        const changes = {
         documents
        }
        const response = await userDao.updateUser(id, changes);
        res.status(201).json({ status: "success", payload: response });
        if (response.user) io.emit("update-user", response.user);
      } catch (error) {
        req.logger.error(error)
        res.status(404).json({
          status: "error",
          payload: { error: error, message: error.message },
        });
      }
    }
}

const userController = new UserController();
export { userController, UserController };
