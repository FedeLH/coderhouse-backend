import { productDao } from "../daos/factory.js";
import { SERVER_URL, PORT } from "../config/config.js";
import { io } from "../config/server.js";

class ProductController {
    getProducts = async (req, res) => {
        try {
          const { limit = 10, page = 1, sort = null } = req.query;
          const query = req.query.query ? JSON.parse(req.query.query) : {};
          const spec = sort
            ? { limit, page, sort: { price: sort }, lean: true }
            : { limit, page, lean: true };
          const response = await productDao.getProducts(query, spec);
          const currentPage = response.page;
          const prevPage = response.prevPage;
          const nextPage = response.nextPage;
      
          res.status(200).json({
            status: "success",
            payload: response.docs,
            totalPages: response.totalPages,
            prevPage: response.prevPage,
            nextPage: response.nextPage,
            page: currentPage,
            hasPrevPage: response.hasPrevPage,
            hasNextPage: response.hasNextPage,
            prevLink: prevPage
              ? `${SERVER_URL}:${PORT}/api/products?limit=${limit}&page=${prevPage}`
              : null,
            nextLink: nextPage
              ? `${SERVER_URL}:${PORT}/api/products?limit=${limit}&page=${nextPage}`
              : null,
          });
        } catch (error) {
          res.status(404).json({
            status: "error",
            payload: { error: error, message: error.message },
          });
        }
    }

    getProduct = async (req, res) => {
        try {
          const id = req.params.pid;
          const product = await productDao.getProductById(id);
          res.status(200).json({ status: "success", payload: product });
        } catch (error) {
          res.status(404).json({
            status: "error",
            payload: { error: error, message: error.message },
          });
        }
    }

    addProduct = async (req, res) => {
        try {
          const product = req.body;
          if (req.user[0].role === 'premium') {
            product.owner = req.user[0]._id
          }
          const response = await productDao.addProduct(product);
          res.status(201).json({ status: "success", payload: response });
          if (response.product) io.emit("add-new-product", response.product);
        } catch (error) {
          res.status(404).json({
            status: "error",
            payload: { error: error, message: error.message },
          });
        }
    }

    updateProduct = async (req, res) => {
        try {
          const id = req.params.pid;
          const products = await productDao.getProductById(id)
          if (req.user[0]._id !== products[0].owner) {
            throw new Error("This product is not yours")
          }
          const changes = req.body;
          const response = await productDao.updateProduct(id, changes);
          res.status(201).json({ status: "success", payload: response });
          if (response.product) io.emit("update-product", response.product);
        } catch (error) {
          res.status(404).json({
            status: "error",
            payload: { error: error, message: error.message },
          });
        }
    }

    deleteProduct = async (req, res) => {
        try {
          const id = req.params.pid;
          const response = await productDao.deleteProduct(id);
          res.status(200).json({ status: "success", payload: response });
        } catch (error) {
          res.status(404).json({
            status: "error",
            payload: { error: error, message: error.message },
          });
        }
    }
}

const productController = new ProductController();
export { productController, ProductController };
