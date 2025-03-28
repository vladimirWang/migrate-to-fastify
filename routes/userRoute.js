import { userLogin } from "../controllers/userController.js";

export default (app, opts, done) => {
  app.post("/login", userLogin);
  done();
};
