import { Router } from "express";
import { productController } from "../controllers/products.controller.js";
import {
  productCreateSchema,
  productUpdateSchema,
} from "../validators/product.validator.js";
import validateObject from "../middlewares/validator.js";
import authorization from "../middlewares/authorization.middleware.js";

const router = Router();

router.get("/", productController.getProducts);

router.get("/:pid", productController.getProduct);

router.post("/", authorization(['admin','premium']), validateObject(productCreateSchema), productController.addProduct);

router.put("/:pid", authorization(['admin','premium']), validateObject(productUpdateSchema), productController.updateProduct);

router.delete("/:pid", authorization(['admin','premium']), productController.deleteProduct);

export default router;
