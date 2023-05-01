import { Router } from "express";
import { userManager } from "../daos/db/user.mongo.dao.js";
import { ADMIN_USER, ADMIN_PASS } from "../config/config.js";
import validateObject from "../middlewares/validator.js";
import {
  loginSchema,
  registerSchema,
} from "../validators/session.validator.js";
import { createHash, checkValidPassword } from '../utils/utils.js';

const router = Router();

router.post("/login", validateObject(loginSchema), async (req, res) => {
  try {
    const { username, password } = req.body;

    if (username === ADMIN_USER && password === ADMIN_PASS) {
      req.session.user = username;
      req.session.role = "admin";
      return res.status(307).redirect("/products");
    }

    const user = await userManager.getUserByEmail(username);

    if (!user.length)
      return res.status(404).json({
        status: "error",
        payload: {
          error: "Invalid",
          message: "User or password invalid",
        },
      });
    
    const isValidPassword = checkValidPassword({
      hashedPassword: user.password,
      password
    })

    if (!isValidPassword)
      return res.status(404).json({
        status: "error",
        payload: {
          error: "Invalid",
          message: "User or password invalid",
        },
      });

    req.session.user = username;
    req.session.role = "user";
    return res.status(307).redirect("/products");
  } catch (error) {
    res.status(404).json({
      status: "error",
      payload: {
        error: error,
        message: error.message,
      },
    });
  }
});

router.post("/register", validateObject(registerSchema), async (req, res) => {
  try {
    const newUser = req.body;
    newUser.password = createHash(newUser.password)
    const user = await userManager.getUserByEmail(newUser.email);

    if (user.length > 0 || newUser.email === ADMIN_USER)
      return res.status(404).json({
        status: "error",
        payload: {
          error: "Invalid",
          message: "User already exists",
        },
      });

    const response = await userManager.addUser(newUser);

    console.log({ response });

    return res.status(307).redirect("/login");
  } catch (error) {
    res.status(404).json({
      status: "error",
      payload: {
        error: error,
        message: error.message,
      },
    });
  }
});

router.get("/logout", (req, res) => {
  try {
    req.session.destroy((err) => {
      if (err) return res.send({ status: "Logout error", message: err });
      return res.status(307).redirect("/login");
    });
  } catch (error) {
    res.status(404).json({
      status: "error",
      payload: {
        error: error,
        message: error.message,
      },
    });
  }
});

export default router;
