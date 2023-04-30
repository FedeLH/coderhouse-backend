import { Router } from "express";

const router = Router();

router.post("/login", (req, res) => {
  try {
    const { username, password } = req.body;

    if (username !== "fede" || password !== "fede") {
      return res.status(401).send("pass o username no es correcto");
    }
    req.session.user = username;
    req.session.admin = true;

    res.send("login success");
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

router.post("/register", (req, res) => {
  try {
    res.status(200).json({ status: "success", payload: {} });
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
      res.send("logout ok");
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
