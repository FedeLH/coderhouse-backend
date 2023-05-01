import { cartModel } from "../../models/cart.model.js";

class CartManager {
  getCarts = async (filter) => {
    return await cartModel.find(filter);
  };

  addCart = async (_) => {
    return await cartModel.create({});
  };

  getCartById = async (cid) => {
    return await cartModel.find({ _id: cid }).lean();
  };

  deleteCart = async (cid) => {
    return await cartModel.deleteOne({ _id: cid });
  };

  addProductByCartId = async (cid, products) => {
    return await cartModel.updateOne({ _id: cid }, { products: products });
  };

  getProductsByCartId = async (cid) => {
    let cart = await this.getCartById(cid);
    return cart[0].products ?? [];
  };

  deleteProductFromCart = async (cid, pid) => {
    let cart = await this.getCartById(cid);
    let products = cart[0].products;
    const index = products.findIndex(
      (product) => product.pid._id.toString() === pid
    );
    if (index === -1)
      throw new Error(
        `The product id: ${pid} is not in the indicated cart id: ${cid}`
      );
    products.splice(index, 1);
    return await cartModel.updateOne({ _id: cid }, { products: products });
  };

  deleteProductsByCartId = async (cid) => {
    return await cartModel.updateOne({ _id: cid }, { products: [] });
  };

  updateProductsByCartId = async (cid, products) => {
    return await cartModel.updateOne({ _id: cid }, { products: products });
  };

  updateProductFromCart = async (cid, pid, quantity) => {
    let cart = await this.getCartById(cid);
    let products = cart[0].products;
    const index = products.findIndex(
      (product) => product.pid._id.toString() === pid
    );
    if (index === -1)
      throw new Error(
        `The product id: ${pid} is not in the indicated cart id: ${cid}`
      );
    products[index].quantity = quantity;
    return await cartModel.updateOne({ _id: cid }, { products: products });
  };
}

const cartManager = new CartManager();
export { cartManager, CartManager };
