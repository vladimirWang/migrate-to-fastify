import { fileUpload } from "../controllers/fileController.js";

export default (app, opts, done) => {
  app.post("/upload", fileUpload);
  done();
};
