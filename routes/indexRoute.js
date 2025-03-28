// import { userLogin } from "./userRoute.js";
import userRoute from "./userRoute.js";

export default (app, opts, done) => {
  app.register(userRoute, { prefix: "/user" });
  done();
};
