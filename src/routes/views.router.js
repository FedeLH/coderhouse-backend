import express from "express";
import { productManager } from "../daos/db/product.mongo.dao.js";
import { cartManager } from "../daos/db/cart.mongo.dao.js";
import { userManager } from "../daos/db/user.mongo.dao.js";

const router = express.Router();

router.get("/products", async (req, res) => {
  try {
    const { limit = 10, page = 1, sort = null } = req.query;
    const query = req.query.query ? JSON.parse(req.query.query) : {};
    const spec = sort
      ? { limit, page, sort: { price: sort }, lean: true }
      : { limit, page, lean: true };
    const { docs, ...rest } = await productManager.getProducts(query, spec);
    const categories = await productManager.getProductsCategories();

    res.render("products", {
      title: "Fed-Tech",
      style: "products.css",
      products: docs,
      paginate: rest,
      categories,
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
    const { docs, ...rest } = await userManager.getUsers(query, spec);

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
    const { docs, ...rest } = await productManager.getProducts(
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

router.get("/carts/:cid", async (req, res) => {
  try {
    const id = req.params.cid;
    const products = await cartManager.getProductsByCartId(id);
    res.render("carts", {
      status: "success",
      title: "Cart",
      style: "cart.css",
      products: products,
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
  const genders = await userManager.getUsersGenders();
  res.render("register", {
    title: "Register",
    style: "/register.css",
    genders,
  });
});

router.get("/login", async (req, res) => {
  res.render("login", { title: "Login", style: "/login.css" });
});

router.get("/profile", async (req, res) => {
  res.render("profile", { title: "Profile", style: "/profile.css" });
});

export default router;
