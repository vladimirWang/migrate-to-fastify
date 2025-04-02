import { getPlatformList } from "../controllers/platformController.js";

export default (app, opts, done) => {
  app.get("/", getPlatformList);
  done();
};
