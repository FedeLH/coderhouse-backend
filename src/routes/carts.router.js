import { Router } from "express";
import { cartController } from "../controllers/carts.controller.js";

const router = Router();

router.get("/", cartController.getCarts);

router.post("/", cartController.addCart);

router.get("/:cid", cartController.getProducts);

router.post("/:cid/products/:pid",cartController.addProduct);

router.delete("/:cid/products/:pid", cartController.deleteProduct);

router.delete("/:cid", cartController.deleteCart);

router.put("/:cid", cartController.updateCart);

router.put("/:cid/products/:pid", cartController.updateProduct);

router.post("/:cid/purchase", cartController.purchaseCart);

export default router;
