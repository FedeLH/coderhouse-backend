import { Router } from "express";
import { mockingController } from "../controllers/mocking.controller.js";

const router = Router();

router.get("/products", mockingController.getProducts);
router.get("/user", mockingController.getUser);

export default router;