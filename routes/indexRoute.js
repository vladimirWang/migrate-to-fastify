// import { userLogin } from "./userRoute.js";
import userRoute from "./userRoute.js";
import vendorRoute from "./vendorRoute.js";

export default (app, opts, done) => {
  app.register(userRoute, { prefix: "/user" });
  app.register(vendorRoute, { prefix: "/vendor" });
  done();
};
