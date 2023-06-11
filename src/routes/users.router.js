import { Router } from "express";
import { userController } from "../controllers/users.controller.js";
import {
  userCreateSchema,
  userUpdateSchema,
} from "../validators/user.validator.js";
import validateObject from "../middlewares/validator.js";


const router = Router();

router.get("/", userController.getUsers);

router.get("/:uid", userController.getUser);

router.post("/", validateObject(userCreateSchema), userController.addUser);

router.put("/:uid", validateObject(userUpdateSchema), userController.updateUser);

router.delete("/:uid", userController.deleteUser);

export default router;
