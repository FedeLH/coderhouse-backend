import { Router } from "express";
import { userController } from "../controllers/users.controller.js";
import {
  userCreateSchema,
  userUpdateSchema,
} from "../validators/user.validator.js";
import validateObject from "../middlewares/validator.js";
import authorization from "../middlewares/authorization.middleware.js"
import { uploader } from "../utils/multer.js";

const documentationQuantity = 3

const router = Router();

router.get("/", authorization(['admin']), userController.getUsers);

router.get("/:uid", authorization(['admin']), userController.getUser);

router.post("/", authorization(['admin']), validateObject(userCreateSchema), userController.addUser);

router.put("/:uid", authorization(['admin']), validateObject(userUpdateSchema), userController.updateUser);

router.delete("/", authorization(['admin']), userController.deleteUsers);

router.delete("/:uid", authorization(['admin']), userController.deleteUser);

router.put("/premium/:uid", authorization(['premium','user']), userController.changeRoleUser);

router.post("/:uid/documents", authorization(['premium','user']), uploader.array("files", documentationQuantity), userController.updateDocumentation); 

export default router;
