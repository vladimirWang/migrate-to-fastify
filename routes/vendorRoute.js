import {
  vendorCreate,
  vendorList,
  vendorDetail,
  vendorUpdate,
} from "../controllers/vendorController.js";

export default (app, opts, done) => {
  app.post("/", vendorCreate);
  app.get("/", vendorList);
  app.get("/byId/:id", vendorDetail);
  app.put("/:id", vendorUpdate);
  done();
};
