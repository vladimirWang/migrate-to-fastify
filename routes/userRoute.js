import {
  userLogin,
  userRegister,
  getCurrentUser,
  updateUser,
} from "../controllers/userController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import {
  loginValidator,
  registerValidator,
} from "../middlewares/userValidator.js";
export default (app, opts, done) => {
  app
    .post("/login", { preHandler: loginValidator }, userLogin)
    .post("/register", { preHandler: registerValidator }, userRegister)
    .get("/current", getCurrentUser)
    .put("/", updateUser);
  done();
};
