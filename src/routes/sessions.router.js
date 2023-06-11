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
    failureRedirect: "/api/sessions/faillogin",
  }),
  async (req, res) => {
    try {
      if (!req.user) {
        return res.status(400).json({
          status: "error",
          payload: {
            error: "Invalid credentials",
            message: "User or password invalid",
          },
        });
      }
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
    failureRedirect: "/api/sessions/failregister",
  }),
  async (req, res) => {
    return res.status(307).redirect("/login");
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
    req.session.role = "user";
    res.redirect("/products");
  }
);

router.get("/failregister", (req, res) => {
  res.send({ status: "error", message: "Failed Register" });
});

router.get("/faillogin", (req, res) => {
  res.send({ status: "error", message: "Failed Login" });
});

router.get("/current", (req, res) => {
  try {
    res.status(200).json({ status: "success", payload: req.user });
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
