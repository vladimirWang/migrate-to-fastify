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

export default (app, opts, done) => {
  app
    .post(
      "/",
      {
        preHandler: [productCreateValidator],
      },
      createProduct
    )
    .get("/", productList)
    .get(
      "/getProductById/:id",
      {
        preHandler: [getProductByIdValidator],
      },
      getProductById
    )
    .put(
      "/updateProductById/:id",
      {
        preHandler: [updateProductValidator],
      },
      updateProduct
    )
    .get(
      "/productTopCount",

      getProductTopCount
    )
    .get(
      "/topValueProduct",

      getTopValueProduct
    );
  done();
};
