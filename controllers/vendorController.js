import {
  getErrorResp,
  getSuccessResp,
  responseError,
} from "../utils/helper.js";
import prisma from "../utils/prisma.js";
import { getPaginationValues, getContainsValues } from "../utils/db.js";
import _ from "lodash";

export const vendorCreate = async (req, rep) => {
  const { name, remark, img } = req.body;
  try {
    const product = await prisma.vendor.create({
      data: {
        name,
        remark,
        img,
      },
    });
    rep.send(getSuccessResp(product, "供应商创建成功"));
  } catch (error) {
    responseError(rep, error);
  }
};
export const vendorList = async (req, rep) => {
  const { limit, page, name } = req.query;
  const { skip, take } = getPaginationValues({ limit, page });
  try {
    // 查询条件
    const whereValues = getContainsValues({ name });
    const vendors = await prisma.vendor.findMany({
      skip,
      take,
      where: whereValues,
      select: {
        id: true,
        name: true,
        isDel: true,
        remark: true,
        img: true,
        fullImg: true,
      },
    });
    const total = await prisma.vendor.count({ where: whereValues });
    rep.send(getSuccessResp({ total, list: vendors }, "供应商列表查询成功"));
  } catch (error) {
    responseError(rep, error);
  }
};
export const vendorDetail = async (req, rep) => {
  const id = req.params.id;
  try {
    const vendorDetail = await prisma.vendor.findUnique({
      where: {
        id: 1 * id,
      },
    });

    rep.send(getSuccessResp(vendorDetail, "获取品牌详情成功"));
  } catch (error) {
    responseError(rep, error);
  }
};
export const vendorUpdate = async (req, rep) => {
  const id = req.params.id;
  const { name, img, remark } = req.body;

  try {
    const vendorDetail = await prisma.vendor.update({
      where: {
        id: 1 * id,
      },
      data: {
        img,
        name,
        remark,
      },
    });
    rep.send(getSuccessResp(vendorDetail, "供应商更新成功"));
  } catch (error) {
    responseError(rep, error);
  }
};
