import express from "express";
import { productDao, cartDao, userDao, tokenDao } from "../daos/factory.js";

const router = express.Router();

router.get("/products", async (req, res) => {
  try {
    let { first_name, last_name, role, email, cart } = req.user[0];

    const userData = {
      name: first_name + " " + last_name,
      role,
      email,
      cart,
    };

    const { limit = 10, page = 1, sort = null } = req.query;
    const query = req.query.query ? JSON.parse(req.query.query) : {};
    const spec = sort
      ? { limit, page, sort: { price: sort }, lean: true }
      : { limit, page, lean: true };
    const { docs, ...rest } = await productDao.getProducts(query, spec);
    const categories = await productDao.getProductsCategories();
    res.render("products", {
      title: "Fed-Tech",
      style: "products.css",
      products: docs,
      paginate: rest,
      categories,
      userData,
    });
  } catch (error) {
    res.render("error", {
      title: "Error",
      style: "error.css",
      error: error,
      message: error.message,
    });
  }
});

router.get("/users", async (req, res) => {
  try {
    const { limit = 10, page = 1, sort = null } = req.query;
    const query = req.query.query ? JSON.parse(req.query.query) : {};
    const spec = { limit, page, lean: true };
    const { docs, ...rest } = await userDao.getUsers(query, spec);

    res.render("users", {
      title: "Fed-Tech",
      style: "users.css",
      users: docs,
      paginate: rest,
    });
  } catch (error) {
    res.render("error", {
      title: "Error",
      style: "error.css",
      error: error,
      message: error.message,
    });
  }
});

router.get("/realTimeProducts", async (req, res) => {
  try {
    const { limit = 10, page = 1, sort = null } = req.query;
    const query = req.query.query ? JSON.parse(req.query.query) : {};
    const spec = sort
      ? { limit, page, sort: { price: sort }, lean: true }
      : { limit, page, lean: true };
    const { docs, ...rest } = await productDao.getProducts(
      { status: true },
      spec
    );

    res.render("realTimeProducts", {
      title: "Fed-Tech",
      style: "realTimeProducts.css",
      products: docs,
      paginate: rest,
    });
  } catch (error) {
    res.render("error", {
      title: "Error",
      style: "error.css",
      error: error,
      message: error.message,
    });
  }
});

router.get("/carts", async (req, res) => {
  try {
    const { cart } = req.user[0];
    const products = await cartDao.getProductsByCartId(cart._id);
    res.render("carts", {
      status: "success",
      title: "Cart",
      style: "cart.css",
      products,
    });
  } catch (error) {
    res.render("error", {
      title: "Error",
      style: "error.css",
      error: error,
      message: error.message,
    });
  }
});

router.get("/chat", (req, res) => {
  res.render("chat", { title: "Chat", style: "/chat.css" });
});

router.get("/", async (req, res) => {
  res.render("home", { title: "Home", style: "/home.css" });
});

router.get("/privacyPolicies", async (req, res) => {
  res.render("privacyPolicies", {
    title: "Privacy Policies",
    style: "/privacyPolicies.css",
  });
});

router.get("/terms&Conditions", async (req, res) => {
  res.render("terms&Conditions", {
    title: "Terms and Conditions",
    style: "/terms&Conditions.css",
  });
});

router.get("/register", async (req, res) => {
  res.render("register", {
    title: "Register",
    style: "/register.css"
  });
});

router.get("/login", async (req, res) => {
  res.render("login", { title: "Login", style: "/login.css" });
});

router.get("/profile", async (req, res) => {
  try {
    const { first_name, last_name, gender, email, role } = req.user[0];

    const userData = {
      first_name,
      last_name,
      role,
      email,
      gender,
      role,
    };

    res.render("profile", {
      title: "Profile",
      style: "/profile.css",
      user: userData,
    });
  } catch (error) {
    res.render("error", {
      title: "Error",
      style: "error.css",
      error: error,
      message: error.message,
    });
  }
});

router.get("/forgot-password", async (req, res) => {
  res.render("forgotPassword", { title: "Forgot password", style: "/forgotPassword.css" });
});

router.get("/reset-password/:uid", async (req, res) => {
  try {
    const receivedToken = req.query.token
    const now = new Date()
    const uid = req.params.uid
    const tokens = await tokenDao.getByUserId(uid)
    if (!tokens.length > 0) {
      throw new Error("This user don't have valid token")
    }
    for (let i = 0; i < tokens.length; i++) {
      const { _id, token, expiration_date } = tokens[i];
      if (expiration_date > now && token === receivedToken) {
        return res.render("resetPassword", { title: "Reset password", style: "/resetPassword.css" });
      }
      await tokenDao.delete(_id)
    }
    throw new Error("This user don't have valid token or your token expirated")
  } catch (error) {
    res.render("error", {
      title: "Error",
      style: "error.css",
      error: error,
      message: error.message,
      path: [{ url: "/forgot-password", text: "Back"}]
    });
  }
});

export default router;
