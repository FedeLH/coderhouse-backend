import { userDao } from "../daos/factory.js";
import { io } from "../config/server.js";
import { SERVER_URL, PORT } from "../config/config.js";
import { sendMailTransport } from "../utils/nodemailer.js";

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
          const arrayUser = await userDao.getUserById(owner)
          const user = arrayUser[0]
          const response = await userDao.deleteUser(id);
          const { first_name, last_name, email } = user
          const configMail = {
            to: email,
            subject: "Usuario eliminado",
            html: `
                <h1>${first_name} ${last_name}</h1>
                <p>Su usuario fue eliminado por inactividad</p>
            `
          }
          await sendMailTransport(configMail)
          res.status(200).json({ status: "success", payload: response });
        } catch (error) {
          res.status(404).json({
            status: "error",
            payload: { error: error, message: error.message },
          });
        }
    }

    deleteUsers = async (req, res) => {
      try {
          const twoDaysAgo = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000);

          const query = {
              last_connection: { $lt: twoDaysAgo },
              status: true
          };

          let currentPage = 1;
          let hasNextPage = true;

          while (hasNextPage) {
              const usersToDelete = await userDao.getUsers( query, { page: currentPage });

              if (usersToDelete.totalDocs === 0) {
                  hasNextPage = false;
                  return res.status(200).json({ status: "success", message: "No hay usuarios para eliminar" });
              }
              
              for (const user of usersToDelete.docs) {
                  const { first_name, last_name, email } = user;
                  await userDao.deleteUser(user._id);
                  const configMail = {
                      to: email,
                      subject: "Usuario eliminado",
                      html: `
                          <h1>${first_name} ${last_name}</h1>
                          <p>Su usuario fue eliminado por inactividad</p>
                      `
                  };
                  await sendMailTransport(configMail);
              }

              hasNextPage = usersToDelete.hasNextPage;
              currentPage++;
          }
          res.status(200).json({ status: "success", message: "Los usuarios han sido eliminados" });
      } catch (error) {
          res.status(404).json({ status: "error", message: error.message });
      }
    }

    changeRoleUser = async (req, res) => {
      try {
        const id = req.params.uid;
        let newRole = 'user'
        if (req.user[0].role === 'user') {
          const arrayUser = await userDao.getUserById(req.user[0]._id)
          const { documents } = arrayUser[0]
          /*
            Documentos obligatorios
            id = Identificación
            address = Comprobante de domicilio
            account = Comprobante de estado de cuenta
          */
          const mandatoryDocuments = ["id","address","account"]
          const actualDocument = documents.map(obj => obj.name)
          const hasAllDocuments = mandatoryDocuments.every(nameDocument => actualDocument.includes(nameDocument))
          if (!hasAllDocuments) throw new Error('You have not finished processing your documentation') 
          newRole = 'premium'
        }
        const changes = {
          role: newRole
        }
        await userDao.updateUser(id, changes);
        res.status(201).json({ status: "success", payload: `Tu nuevo rol es ${newRole} por favor inicia sesión nuevamente` });
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
