// import { userLogin } from "./userRoute.js";
import userRoute from "./userRoute.js";
import vendorRoute from "./vendorRoute.js";
import productRoute from "./productRoute.js";
import fileRoute from "./fileRoute.js";
import trolleyRoute from "./trolleyRoute.js";
import purchaseRoute from "./purchaseRoute.js";
import saleTrolleyRoute from "./saleTrolleyRoute.js";

export default (app, opts, done) => {
  app
    .register(userRoute, { prefix: "/user" })
    .register(vendorRoute, { prefix: "/vendor" })
    .register(productRoute, { prefix: "/product" })
    .register(fileRoute, { prefix: "/file" })
    .register(trolleyRoute, { prefix: "/trolley" })
    .register(purchaseRoute, { prefix: "/import" })
    .register(saleTrolleyRoute, { prefix: "/exportTrolley" });
  done();
};
