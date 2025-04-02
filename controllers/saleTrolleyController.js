import prisma from "../utils/prisma.js";
import {
  getSuccessResp,
  responseError,
  generateGroupsByVendorId,
} from "../utils/helper.js";
import _ from "lodash";

export const createExportTrolley = async (req, res) => {
  const userId = req.user.id;
  const { price, count, productId } = req.body;

  try {
    const result = await prisma.saleTrolley.create({
      data: {
        createdUser: { connect: { id: userId } },
        saleTrolleyJoinProduct: {
          create: [
            {
              count,
              price,
              product: {
                connect: {
                  id: productId,
                },
              },
            },
          ],
        },
      },
    });
    res.send({ msg: "出货单创建成功", data: result });
  } catch (error) {
    responseError(res, error);
  }
};

export const exportTrolleyList = async (req, res) => {
  try {
    const list = await prisma.saleTrolley.findMany({
      include: {
        saleTrolleyJoinProduct: {
          include: {
            product: true,
          },
        },
      },
      // select: {
      //   id: true,
      // },
    });
    const total = await prisma.saleTrolley.count();
    res.send(getSuccessResp({ list, total }, "出货列表获取成功"));
  } catch (error) {
    responseError(res, error);
  }
};

export const getExportTrolleyDetailById = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await prisma.saleTrolley.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        saleTrolleyJoinProduct: {
          include: {
            product: {
              include: {
                vendor: true,
              },
            },
          },
        },
      },
    });
    const { saleTrolleyJoinProduct, ...rest } = result;
    const grouped = generateGroupsByVendorId(saleTrolleyJoinProduct);

    // { ...rest, exportProduct: grouped }
    res.send(
      getSuccessResp(
        { ...rest, saleTrolleyJoinProduct: grouped },
        "出货单详情获取正常"
      )
    );
  } catch (error) {
    responseError(res, error);
  }
};

export const updateExportTrolley = async (req, res) => {
  try {
    const { productId, operation, increment, count, price, deleteTrolley } =
      req.body;

    const saleTrolleyId = Number(req.params.id);

    const result = await prisma.$transaction([
      // // 修改出货单总价
      // prisma.ExportTrolley.update({
      //   where: {
      //     id: saleTrolleyId,
      //   },
      //   data: {
      //     totalPrice: {
      //       increment: newTotalExpression,
      //     },
      //   },
      // }),
      // 修改中间表数量
      ...(operation === "create"
        ? [
            prisma.saleTrolleyJoinProduct.create({
              data: {
                export: { connect: { id: saleTrolleyId } },
                product: { connect: { id: productId } },
                count,
                price,
              },
            }),
          ]
        : []),
      ...(operation === "update"
        ? [
            prisma.saleTrolleyJoinProduct.update({
              where: {
                saleTrolleyId_productId: {
                  saleTrolleyId,
                  productId,
                },
              },
              data: {
                count: {
                  increment,
                },
              },
            }),
          ]
        : []),
      ...(operation === "delete"
        ? [
            prisma.saleTrolleyJoinProduct.delete({
              where: {
                saleTrolleyId_productId: {
                  saleTrolleyId,
                  productId,
                },
              },
            }),
          ]
        : []),
      ...(operation === "delete" && deleteTrolley
        ? [
            prisma.saleTrolley.delete({
              where: {
                id: saleTrolleyId,
              },
            }),
          ]
        : []),
    ]);
    res.send(getSuccessResp(null, "修改出货单成功"));
  } catch (error) {
    responseError(res, error);
  }
};

export const updateExportTrolleyBatch = async (req, res) => {
  try {
    const saleTrolleyId = Number(req.params.id);
    const { checked } = req.body;
    const existed = await prisma.saleTrolleyJoinProduct.findMany({
      where: {
        saleTrolleyId,
      },
    });

    const checkedIds = _.map(checked, "id");
    const existedIds = _.map(existed, "productId");
    // // 找出新增的 id
    const newIds = _.difference(checkedIds, existedIds);

    const updatedIds = _.intersection(checkedIds, existedIds);
    const newProducts = _.filter(checked, (item) =>
      _.includes(newIds, item.id)
    );
    await prisma.$transaction([
      // 原本不存在的商品，插入新数据
      ...newProducts.map((product) => {
        return prisma.saleTrolleyJoinProduct.create({
          data: {
            saleTrolleyId,
            productId: product.id,
            count: 1,
            price: product.price,
          },
        });
      }),
      // 选中的商品原本已存在，在老的基础上增加
      ...updatedIds.map((id) => {
        return prisma.saleTrolleyJoinProduct.update({
          where: {
            saleTrolleyId_productId: {
              saleTrolleyId,
              productId: id,
            },
          },
          data: {
            count: {
              increment: 1,
            },
          },
        });
      }),
    ]);

    res.send(getSuccessResp({ existed }, "更新成功"));
  } catch (error) {
    responseError(res, error);
  }
};
