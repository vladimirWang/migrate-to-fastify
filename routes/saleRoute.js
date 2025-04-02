import { createSale } from "../controllers/saleController.js";

export default (app, opts, done) => {
  app.post("/upload", createSale);
  done();
};
