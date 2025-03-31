import { pipeline } from "node:stream/promises";
import path from "node:path";
import fs from "node:fs";
import { v7 as uuid } from "uuid";
import { getSuccessResp, responseError, getBaseUrl } from "../utils/helper.js";

export const fileUpload = async (req, rep) => {
  try {
    const data = await req.file();
    const fileName = data.filename;
    const ext = path.extname(fileName);
    const newFileName = `uploaded_${uuid()}${ext}`;

    let newFilePath = path.resolve(__dirname, "./static", newFileName);
    if (process.env.NODE_ENV === "production") {
      newFilePath = "/var/www/gallery_static/static/" + newFileName;
    }

    await pipeline(data.file, fs.createWriteStream(newFilePath));
    const respData = {
      filePathForSave: newFileName,
      filePathForView: `${getBaseUrl(req)}/static/${newFileName}`,
    };
    rep.send(getSuccessResp(respData));
  } catch (error) {
    responseError(rep, error);
  }
};
