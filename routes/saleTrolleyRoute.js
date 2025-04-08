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
    .post("/", createExportTrolley)
    .get("/", exportTrolleyList)
    .get("/:id", getExportTrolleyDetailById)
    .put("/:id", updateExportTrolley)
    .put("/batch/:id", updateExportTrolleyBatch);
  done();
};
