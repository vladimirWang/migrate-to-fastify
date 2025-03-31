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
    .post("/", { preHandler: authMiddleware }, createTrolley)
    .put("/:id", { preHandler: authMiddleware }, updateTrolley)
    .get("/", { preHandler: authMiddleware }, getCurrentUserTrolleyDetail)
    .get(
      "/:id/:productId",
      { preHandler: authMiddleware },
      productIsExistedInTrolley
    )
    .delete("/:id", { preHandler: authMiddleware }, deleteTrolleyById);
  done();
};
