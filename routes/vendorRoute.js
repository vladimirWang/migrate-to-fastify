import {
  vendorCreate,
  vendorList,
  vendorDetail,
  vendorUpdate,
} from "../controllers/vendorController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

export default (app, opts, done) => {
  app.post("/", { preHandler: authMiddleware }, vendorCreate);
  app.get("/", { preHandler: authMiddleware }, vendorList);
  app.get("/byId/:id", { preHandler: authMiddleware }, vendorDetail);
  app.put("/:id", { preHandler: authMiddleware }, vendorUpdate);
  done();
};
