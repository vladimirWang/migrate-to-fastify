import { createSale } from "../controllers/saleController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

export default (app, opts, done) => {
  app.post("/", createSale);
  done();
};
