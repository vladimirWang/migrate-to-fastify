import { getExpressList } from "../controllers/expressController.js";

export default (app, opts, done) => {
  app.get("/", getExpressList);
  done();
};
