import {
  createSale,
  getSaleOrderList,
  getSaleOrderDetailById,
  confirmByClient,
  updateAuxiliaryInfo,
  updateSaleOrderProductInfoBatch,
  updateSaleOrderProductInfo,
  updateSaleOrderStatus,
} from "../controllers/saleController.js";

export default (app, opts, done) => {
  app
    .post("/", createSale)
    .get("/", getSaleOrderList)
    .get("/:id", getSaleOrderDetailById)
    .patch("/confirmByClient/:id", confirmByClient)
    .patch("/updateAuxiliaryInfo/:id", updateAuxiliaryInfo)
    .patch(
      "/updateSaleOrderProductInfoBatch/:id",
      updateSaleOrderProductInfoBatch
    )
    .patch("/updateSaleOrderProductInfo/:id", updateSaleOrderProductInfo)
    .patch("/updateSaleOrderStatus/:id", updateSaleOrderStatus);
  done();
};
