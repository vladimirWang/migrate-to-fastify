import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
  createTrolley,
  updateTrolley,
  getCurrentUserTrolleyDetail,
  productIsExistedInTrolley,
  deleteTrolleyById,
} from "../controllers/trolleyController.js";

export default (app, opts, done) => {
  app
    .post("/", createTrolley)
    .put("/:id", updateTrolley)
    .get("/", getCurrentUserTrolleyDetail)
    .get("/:id/:productId", productIsExistedInTrolley)
    .delete("/:id", deleteTrolleyById);
  done();
};
