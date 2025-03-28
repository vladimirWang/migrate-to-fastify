import { userLogin, userRegister } from "../controllers/userController.js";
import {
  loginValidator,
  registerValidator,
} from "../middlewares/userValidator.js";
export default (app, opts, done) => {
  app.post("/login", { preHandler: loginValidator }, userLogin);
  app.post("/register", { preHandler: registerValidator }, userRegister);
  done();
};
