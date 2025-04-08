import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
  createPurchase,
  getGroupedImports,
  batchCreateImport,
  getImportDetail,
  confirmPurchase,
  revokePurchase,
} from "../controllers/purchaseController.js";

export default (app, opts, done) => {
  app
    .post("/", createPurchase)
    .get("/", getGroupedImports)
    .post("/batch", batchCreateImport)
    .get("/getImportDetail/:id", getImportDetail)
    .post("/confirm/:id", confirmPurchase)
    .post("/revoke", revokePurchase);
  done();
};
