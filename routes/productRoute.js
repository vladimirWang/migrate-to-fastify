import {
  productCreateValidator,
  getProductByIdValidator,
  updateProductValidator,
} from "../middlewares/productValidator.js";
import {
  createProduct,
  productList,
  getProductById,
  updateProduct,
  getProductTopCount,
  getTopValueProduct,
} from "../controllers/productController.js";
// const Router = require("express").Router;
// const productCtrl = require("../controller/product");
// const productValidator = require("../middlewares/validator/productValidator");
// const authValidator = require("../middlewares/validator/authValidator");
// const { upload } = require("../util/index");
// const router = Router();

import { authMiddleware } from "../middlewares/authMiddleware.js";

export default (app, opts, done) => {
  app
    .post(
      "/",
      {
        preHandler: [authMiddleware, productCreateValidator],
      },
      createProduct
    )
    .get("/", { preHandler: authMiddleware }, productList)
    .get(
      "/getProductById/:id",
      {
        preHandler: [authMiddleware, getProductByIdValidator],
      },
      getProductById
    )
    .put(
      "/updateProductById/:id",
      {
        preHandler: [authMiddleware, updateProductValidator],
      },
      // authValidator.auth,
      // productValidator.update,
      // upload.single("img"),
      updateProduct
    )
    .get(
      "/productTopCount",
      {
        preHandler: authMiddleware,
      },
      getProductTopCount
    )
    .get(
      "/topValueProduct",
      {
        preHandler: authMiddleware,
      },
      getTopValueProduct
    );
  done();
};
