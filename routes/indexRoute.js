// import { userLogin } from "./userRoute.js";
import userRoute from "./userRoute.js";
import vendorRoute from "./vendorRoute.js";
import productRoute from "./productRoute.js";
import fileRoute from "./fileRoute.js";

export default (app, opts, done) => {
  app.register(userRoute, { prefix: "/user" });
  app.register(vendorRoute, { prefix: "/vendor" });
  app.register(productRoute, { prefix: "/product" });
  app.register(fileRoute, { prefix: "/file" });
  done();
};
