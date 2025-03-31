// import { userLogin } from "./userRoute.js";
import userRoute from "./userRoute.js";
import vendorRoute from "./vendorRoute.js";
import productRoute from "./productRoute.js";

export default (app, opts, done) => {
  app.register(userRoute, { prefix: "/user" });
  app.register(vendorRoute, { prefix: "/vendor" });
  app.register(productRoute, { prefix: "/product" });
  done();
};
