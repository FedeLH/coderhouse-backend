import { Router } from "express";
import { productController } from "../controllers/products.controller.js";
import {
  productCreateSchema,
  productUpdateSchema,
} from "../validators/product.validator.js";
import validateObject from "../middlewares/validator.js";


const router = Router();

router.get("/", productController.getProducts);

router.get("/:pid", productController.getProduct);

router.post("/", authorization('admin'), validateObject(productCreateSchema), productController.addProduct);

router.put("/:pid", authorization('admin'), validateObject(productUpdateSchema), productController.updateProduct);

router.delete("/:pid", authorization('admin'), productController.deleteProduct);

export default router;
