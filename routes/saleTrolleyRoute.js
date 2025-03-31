import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
  createExportTrolley,
  exportTrolleyList,
  getExportTrolleyDetailById,
  updateExportTrolley,
  updateExportTrolleyBatch,
} from "../controllers/saleTrolleyController.js";

export default (app, opts, done) => {
  app
    .post("/", { preHandler: authMiddleware }, createExportTrolley)
    .get("/", { preHandler: authMiddleware }, exportTrolleyList)
    .get("/:id", { preHandler: authMiddleware }, getExportTrolleyDetailById)
    .put("/:id", { preHandler: authMiddleware }, updateExportTrolley)
    .put(
      "/batch/:id",
      { preHandler: authMiddleware },
      updateExportTrolleyBatch
    );
  done();
};
