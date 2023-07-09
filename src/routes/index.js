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
import loggerTestRouter from "./loggerTest.router.js"
import passwordsRouter from "./passwords.router.js"
import swaggerUiExpress from 'swagger-ui-express'
import swaggerSpecs from "../config/swagger.js"

export const router = Router();
router.use("/api/docs",swaggerUiExpress.serve, swaggerUiExpress.setup(swaggerSpecs))
router.use("/api/images", authorization(['user','premium']), imagesRouter);
router.use("/api/products", productsRouter);
router.use("/api/carts", authorization(['user','premium']), cartsRouter);
router.use("/api/sessions", sessionsRouter);
router.use("/api/users", usersRouter);
router.use("/api/passwords", passwordsRouter);
router.use("/api/tests", testsRouter);
router.use("/mocking", mockingRouter)
router.use("/loggerTest", loggerTestRouter)
router.use("/", viewsRouter);
router.use(errorHandler)
