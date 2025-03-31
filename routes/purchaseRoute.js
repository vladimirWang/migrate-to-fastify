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
    .post("/", { preHandler: authMiddleware }, createPurchase)
    .get("/", { preHandler: authMiddleware }, getGroupedImports)
    .post("/batch", { preHandler: authMiddleware }, batchCreateImport)
    .get(
      "/getImportDetail/:id",
      { preHandler: authMiddleware },
      getImportDetail
    )
    .post("/confirm/:id", { preHandler: authMiddleware }, confirmPurchase)
    .post("/revoke", { preHandler: authMiddleware }, revokePurchase);
  done();
};
