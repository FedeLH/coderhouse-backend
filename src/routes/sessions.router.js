import { Router } from "express";
import validateObject from "../middlewares/validator.js";
import {
  loginSchema,
  registerSchema,
} from "../validators/session.validator.js";
import passport from "passport";

const router = Router();

router.post(
  "/login",
  validateObject(loginSchema),
  passport.authenticate("login", {
    failuredRegister: "/api/sessions/failedlogin",
  }),
  async (req, res) => {
    try {
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
  }
);

router.post(
  "/register",
  validateObject(registerSchema),
  passport.authenticate("register", {
    failureRedirect: "/api/sessions/failedregister",
  }),
  async (req, res) => {
    try {
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
  }
);

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

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get(
  "/githubcallback",
  passport.authenticate("github", {
    failureRedirect: "/api/sessions/failregister",
  }),
  (req, res) => {
    req.session.user = req.user;
    req.session.role = "user-github";
    res.redirect("/products");
  }
);

router.get("/failedregister", (req, res) => {
  res.send({ status: "error", message: "Failed Register" });
});

router.get("/failedlogin", (req, res) => {
  res.send({ status: "error", message: "Failed Login" });
});

export default router;
