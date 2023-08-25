import { cartDao, productDao, ticketDao } from "../daos/factory.js";
import EErrors from "../utils/errors/EErrors.js";
import CustomError from "../utils/errors/CustomError.js";
import { generateEmptyCartErrorInfo, generatePurchaseCartErrorInfo } from "../utils/errors/info.js";
import { sendMailTransport } from "../utils/nodemailer.js";

class CartController {
    getCarts = async (req, res) => {
        try {
          const filter = req.query.filter ? JSON.parse(req.query.filter) : {};
          const allCarts = await cartDao.getCarts(filter);
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
          const response = await cartDao.addCart();
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
          const products = await cartDao.getProductsByCartId(id);
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
          const arrayProduct = await productDao.getProductById(pid)
          if (req.user[0]._id === arrayProduct[0].owner) {
            throw new Error("This product is yours")
          }
          let products = await cartDao.getProductsByCartId(cid);
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
          const response = await cartDao.addProductByCartId(cid, products);
      
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
          const response = await cartDao.deleteProductFromCart(cid, pid);
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
          const response = await cartDao.deleteProductsByCartId(cid);
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
          const response = await cartDao.updateProductsByCartId(cid, products);
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
          const response = await cartDao.updateProductFromCart(
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

    purchaseCart = async (req, res, next) => {
      try {
        const { first_name, last_name, cart, email } = req.user[0];
        const products = await cartDao.getProductsByCartId(cart._id);
        if (!products.length) {
          CustomError.createError({
            name: "Empty cart error",
            cause: generateEmptyCartErrorInfo(),
            message: "Error trying to get products from the cart",
            code: EErrors.EMPTY_CART_ERROR
          })
        }
        const generateId = () => Math.random().toString(36).substring(2, 18);
        let remainingProducts = []
        let purchasedProducts = []
        let totalAmount = 0
        for (let i = 0; i < products.length; i++) {
          const product = products[i];
          const arrayProduct = await productDao.getProductById(product.pid._id)
          const { stock } = arrayProduct[0]
          if ( product.quantity <= stock) {
            const newStock = stock - product.quantity
            await productDao.updateProduct(product.pid._id,{stock: newStock})
            purchasedProducts.push(product)
            totalAmount += product.pid.price * product.quantity
          } else {
            remainingProducts.push(product)
          }
        }
        await cartDao.updateProductsByCartId(cart._id, remainingProducts)
        if (!purchasedProducts.length) {
          CustomError.createError({
            name: "Purchase cart error",
            cause: generatePurchaseCartErrorInfo(),
            message: "Error trying to purchase products",
            code: EErrors.PURCHASE_CART_ERROR
          })
        }
        const newTicket = {
          code: generateId(),
          purchase_datetime: Date.now(),
          products: purchasedProducts,
          amount: totalAmount,
          purchaser: email
        }
        await ticketDao.create(newTicket)
        const configMail = {
            to: email,
            subject: "Confirmación de compra",
            html: `
                <h1>${first_name} ${last_name}</h1>
                <p>Usted a realizado una compra en nuestra tienda por $ ${newTicket.amount}</p>
                <p>El codigo de su compra es  ${newTicket.code}</p>
            `
        }
        await sendMailTransport(configMail)
        res.status(201).json({ status: "success", payload: newTicket });
      } catch (error) {
          next(error)
      }
    }
}

const cartController = new CartController();
export { cartController, CartController };
