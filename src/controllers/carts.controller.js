import { cartManager } from "../daos/db/cart.mongo.dao.js";

class CartController {
    getCarts = async (req, res) => {
        try {
          const filter = req.query.filter ? JSON.parse(req.query.filter) : {};
          const allCarts = await cartManager.getCarts();
          const limit = req.query.limit;
          let limitedCarts = [];
          if (limit) limitedCarts = allCarts.slice(0, limit);
          res
            .status(200)
            .json({ status: "success", payload: limit ? limitedCarts : allCarts });
        } catch (error) {
          res.status(404).json({
            status: "error",
            payload: { error: error, message: error.message },
          });
        }
    }

    addCart = async (req, res) => {
        try {
          const response = await cartManager.addCart();
          res.status(201).json({ status: "success", payload: response });
        } catch (error) {
          res.status(404).json({
            status: "error",
            payload: { error: error, message: error.message },
          });
        }
    }

    getProducts = async (req, res) => {
        try {
          const id = req.params.cid;
          const products = await cartManager.getProductsByCartId(id);
          res.status(200).json({ status: "success", payload: products });
        } catch (error) {
          res.status(404).json({
            status: "error",
            payload: { error: error, message: error.message },
          });
        }
    }

    addProduct = async (req, res) => {
        try {
          const cid = req.params.cid;
          const pid = req.params.pid;
          let products = await cartManager.getProductsByCartId(cid);
          let encontrado = false;
          for (let i = 0; i < products.length; i++) {
            const product = products[i];
            if (product.pid._id.toString() === pid) {
              product.quantity += 1;
              encontrado = true;
              break;
            }
          }
      
          if (!encontrado) products = [...products, { pid: pid, quantity: 1 }];
          const response = await cartManager.addProductByCartId(cid, products);
      
          res.status(201).json({ status: "success", payload: response });
        } catch (error) {
          res.status(404).json({
            status: "error",
            payload: { error: error, message: error.message },
          });
        }
    }

    deleteProduct = async (req, res) => {
        try {
          const cid = req.params.cid;
          const pid = req.params.pid;
          const response = await cartManager.deleteProductFromCart(cid, pid);
          res.status(200).json({ status: "success", payload: response });
        } catch (error) {
          res.status(404).json({
            status: "error",
            payload: { error: error, message: error.message },
          });
        }
    }

    deleteCart = async (req, res) => {
        try {
          const cid = req.params.cid;
          const response = await cartManager.deleteProductsByCartId(cid);
          res.status(200).json({ status: "success", payload: response });
        } catch (error) {
          res.status(404).json({
            status: "error",
            payload: { error: error, message: error.message },
          });
        }
    }

    updateCart = async (req, res) => {
        try {
          const cid = req.params.cid;
          const products = req.body;
          const response = await cartManager.updateProductsByCartId(cid, products);
          res.status(201).json({ status: "success", payload: response });
        } catch (error) {
          res.status(404).json({
            status: "error",
            payload: { error: error, message: error.message },
          });
        }
    }

    updateProduct = async (req, res) => {
        try {
          const cid = req.params.cid;
          const pid = req.params.pid;
          const { quantity } = req.body;
          const response = await cartManager.updateProductFromCart(
            cid,
            pid,
            quantity
          );
          res.status(201).json({ status: "success", payload: response });
        } catch (error) {
          res.status(404).json({
            status: "error",
            payload: { error: error, message: error.message },
          });
        }
    }
}

const cartController = new CartController();
export { cartController, CartController };