import { Router } from "express";
import productsRouter from "./products.router.js";
import cartsRouter from "./carts.router.js";
import viewsRouter from "./views.router.js";
import imagesRouter from "./images.router.js";
import sessionsRouter from "./sessions.router.js";
import testsRouter from "./tests.router.js";
import usersRouter from "./users.router.js";
import errorHandler from "../middlewares/errors/index.js";
import authorization from "../middlewares/authorization.middleware.js";
import mockingRouter from "./mocking.router.js";

export const router = Router();
router.use("/api/images", authorization('user'), imagesRouter);
router.use("/api/products", productsRouter);
router.use("/api/carts", authorization('user'), cartsRouter);
router.use("/api/sessions", sessionsRouter);
router.use("/api/users", authorization('admin'), usersRouter);
router.use("/api/tests", testsRouter);
router.use("/mockingproducts", mockingRouter)
router.use("/", viewsRouter);
router.use(errorHandler)
