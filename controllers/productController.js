import prisma from "../utils/prisma.js";
import {
  getErrorResp,
  getSuccessResp,
  responseError,
  getValidNumber,
} from "../utils/helper.js";
import { getPaginationValues, getContainsValues } from "../utils/db.js";

export const createProduct = async (req, rep) => {
  const { name, remark, vendorId, price, cost, img } = req.body;

  try {
    const product = await prisma.product.create({
      data: {
        name,
        remark,
        vendorId,
        price,
        cost,
        img,
      },
    });
    rep.send(getSuccessResp(product, "商品创建成功"));
  } catch (error) {
    responseError(rep, error);
  }
};

export const productList = async (req, rep) => {
  const { limit, page, name, minCost, maxCost, minPrice, maxPrice } = req.query;
  const { skip, take } = getPaginationValues({ limit, page });
  try {
    // 查询条件
    const containValues = getContainsValues({ name });
    const whereValues = {
      ...containValues,
      AND: [
        {
          cost: { gte: getValidNumber(minCost), lte: getValidNumber(maxCost) },
        },
        {
          price: {
            gte: getValidNumber(minPrice),
            lte: getValidNumber(maxPrice),
          },
        },
      ],
    };
    let products = await prisma.product.findMany({
      skip,
      take,
      where: whereValues,
      select: {
        id: true,
        fullImg: true,
        price: true,
        cost: true,
        balance: true,
        name: true,
        vendor: true,
      },
      // where: {
      //   name: {
      //     contains: name,
      //   },
      // },
    });
    const total = await prisma.product.count({ where: whereValues });

    rep.send(getSuccessResp({ total, list: products }, "商品列表查询成功"));
  } catch (error) {
    responseError(rep, error);
  }
};

export const getProductById = async (req, rep) => {
  try {
    const product = await prisma.product.findUnique({
      where: {
        id: Number(req.params.id),
      },
      include: {
        vendor: true,
      },
    });
    rep.send(getSuccessResp(product, "获取商品详情成功"));
  } catch (error) {
    responseError(rep, error);
  }
};

export const updateProduct = async (req, rep) => {
  try {
    const { id } = req.params;
    const { name, remark, vendorId, price, cost, img } = req.body;
    const product = await prisma.product.update({
      where: { id: Number(id) },
      data: { name, remark, vendorId, price, cost, img },
    });
    rep.send({ msg: "ok", data: product, success: true });
  } catch (error) {
    responseError(rep, error);
  }
};

export const getProductTopCount = async (req, rep) => {
  try {
    const result = await prisma.product.findMany({
      take: 10,
      orderBy: {
        balance: "desc",
      },
    });

    rep.send(getSuccessResp(result, "前十大库存数加载成功"));
  } catch (error) {
    responseError(rep, error);
  }
};

// 前十大库存货值商品
export const getTopValueProduct = async (req, rep) => {
  try {
    const result =
      await prisma.$queryRaw`SELECT id, name,balance,cost, (balance * cost) AS inventory_value FROM Product ORDER BY inventory_value DESC LIMIT 10`;
    const converted = result.map((product) => ({
      ...product,
      inventory_value: product.inventory_value
        ? Number(product.inventory_value.toString())
        : null,
      // 其他 BigInt 字段也需类似处理，例如：
      // balance: product.balance?.toString(),
      // cost: product.cost?.toString(),
    }));
    rep.send(getSuccessResp(converted, "前十大库存货值加载成功"));
  } catch (error) {
    responseError(rep, error);
  }
};

export const updateAvailableById = async (req, rep) => {
  try {
    const { id } = req.params;
    const parsedId = Number(id);
    const result = await prisma.product.update({
      where: { id: parsedId },
      data: { available: false },
    });

    rep.send(getSuccessResp(result, "商品上架状态更新成功"));
  } catch (error) {
    responseError(rep, error);
  }
};
