import { getSuccessResp, responseError } from "../utils/helper.js";
import prisma from "../utils/prisma.js";

export const getPlatformList = async (req, rep) => {
  try {
    const result = await prisma.platform.findMany();
    rep.send(getSuccessResp(result));
  } catch (error) {
    responseError(rep, error);
  }
};
