import { getSuccessResp, responseError } from "../utils/helper.js";
import prisma from "../utils/prisma.js";
import { sum, groupsByVendorId } from "../utils/helper.js";
import _ from "lodash";
// import { sortBy } from "lodash";

// 确认确认出货-生成销售订单
export const createSale = async (req, rep) => {
  const userId = req.user.id;
  const {
    // purchaseDate,
    platformId,
    platformOrderNo,
    expressId,
    expressNo,
    expressFee,
    remark,
    products,
    saleTrolleyId,
  } = req.body;
  try {
    const totalPrice = products.reduce((a, c) => {
      return sum(a, c.price * c.count);
    }, 0);
    const result = await prisma.$transaction(async (tx) => {
      // 生成出货记录
      await tx.saleOrder.create({
        data: {
          // purchaseDate: purchaseDate ? new Date(purchaseDate) : undefined,
          purchaseDate: new Date(),
          platformOrderNo,
          // client: {
          //   connect: clientId,
          // },
          totalPrice,
          remark,
          // createdUser: {
          //   connect: {
          //     id: userId,
          //   },
          // },
          // express: {
          //   connect: {
          //     id: expressId,
          //   },
          // },
          // expressNo,
          // expressFee,
          // platform: {
          //   connect: {
          //     id: platformId,
          //   },
          // },
          status: "TO_SHIP",
          saleOrderJoinProduct: {
            create: products.map((product) => {
              return {
                productId: product.productId,
                price: product.price,
                count: product.count,
              };
            }),
          },
        },
      });
      // // 删除待出货的中间表数据
      // if (Array.isArray(products)) {
      //   products.map((product) => {
      //     return tx.saleTrolleyJoinProduct.delete({
      //       where: {
      //         saleTrolleyId_productId: {
      //           saleTrolleyId: saleTrolleyId,
      //           productId: product.productId,
      //         },
      //       },
      //     });
      //   });
      // }
      //  step2 删除待出货的对应记录
      // 联动删除中间表saleTrolleyJoinProduct的数据
      // await tx.saleTrolley.delete({
      //   where: {
      //     id: saleTrolleyId,
      //   },
      // });
      // 修改产品库存
      if (Array.isArray(products)) {
        const promises = products.map((product) => {
          return tx.product.update({
            where: {
              id: product.productId,
            },
            data: {
              balance: {
                decrement: product.count,
              },
            },
          });
        });
        await Promise.all(promises);
      }
    });
    rep.send(getSuccessResp(result, "出货记录创建成功"));
  } catch (error) {
    responseError(rep, error);
  }
};

// 查询销售订单
export const getSaleOrderList = async (req, rep) => {
  try {
    const { page = 1, pageSize = 10, status } = req.query;
    const whereValues = {
      status,
    };
    const total = await prisma.saleOrder.count({
      where: whereValues,
    });
    const saleOrders = await prisma.saleOrder.findMany({
      where: whereValues,
      skip: (page - 1) * pageSize,
      take: Number(pageSize),
      orderBy: {
        updatedAt: "desc",
      },
      include: {
        express: true,
        platform: true,
        //   createdUser: true,
        saleOrderJoinProduct: {
          include: {
            product: true,
          },
        },
      },
    });
    rep.send(
      getSuccessResp({ total, list: saleOrders }, "出货记录列表查询成功")
    );
  } catch (error) {
    responseError(rep, error);
  }
};

export const getSaleOrderDetailById = async (req, rep) => {
  try {
    const id = req.params.id;
    const result = await prisma.saleOrder.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        saleOrderJoinProduct: {
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
    // 把供应商的数据提到最上层, 便于后续按供应商分组
    let converted = [];
    if (Array.isArray(result?.saleOrderJoinProduct)) {
      converted = result.saleOrderJoinProduct.reduce((a, c) => {
        a = a.concat({
          ...c,
          // 把供应商的数据提到最上层, 便于后续按供应商分组
          vendor: c?.product?.vendor,
        });

        return a;
      }, []);
    }

    let temp = groupsByVendorId(converted);
    console.log("--temp--", temp);
    result.saleOrderJoinProduct = temp;
    rep.send(getSuccessResp(result, "销售订单查询成功"));
  } catch (error) {
    responseError(rep, error);
  }
};

// 更新销售单中的平台订单号，快递等信息
export const updateAuxiliaryInfo = async (req, rep) => {
  try {
    const id = req.params.id;
    const { expressId, expressFee, expressNo, platformId, platformOrderNo } =
      req.body;
    await prisma.saleOrder.update({
      where: {
        id: Number(id),
      },
      data: {
        expressId,
        expressFee,
        expressNo,
        platformId,
        platformOrderNo,
      },
    });
    rep.send(getSuccessResp(null, "订单辅助信息更新成功"));
  } catch (error) {
    responseError(rep, error);
  }
};

// 客户确认收货
export const confirmByClient = async (req, rep) => {
  try {
    const result = await prisma.saleOrder.update({
      where: {
        id: Number(req.params.id),
      },
      data: {
        status: "CONFIRMED",
      },
    });
    rep.send(getSuccessResp(null, "客户确认收货成功"));
  } catch (error) {
    responseError(rep, error);
  }
};

// 更新出货单中的多个商品信息
export const updateSaleOrderProductInfoBatch = async (req, res) => {
  try {
    const saleOrderId = Number(req.params.id);
    const { checked } = req.body;
    const existed = await prisma.saleOrderJoinProduct.findMany({
      where: {
        saleOrderId,
      },
    });

    // 这次提交的商品id
    const checkedIds = _.map(checked, "id");
    // 已存在的商品id
    const existedIds = _.map(existed, "productId");
    // 找出新增的 id
    const newIds = _.difference(checkedIds, existedIds);

    // 这次提交的和已存在的商品id的交集
    const updatedIds = _.intersection(checkedIds, existedIds);
    const newProducts = _.filter(checked, (item) =>
      _.includes(newIds, item.id)
    );
    await prisma.$transaction([
      // 原本不存在的商品，插入新数据
      ...newProducts.map((product) => {
        return prisma.saleOrderJoinProduct.create({
          data: {
            saleOrderId,
            productId: product.id,
            count: 1,
            price: product.price,
          },
        });
      }),
      // 选中的商品原本已存在，在老的基础上增加
      ...updatedIds.map((id) => {
        return prisma.saleOrderJoinProduct.update({
          where: {
            saleTrolleyId_productId: {
              saleOrderId,
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

// 更新出货单中的单个商品信息
export const updateSaleOrderProductInfo = async (req, res) => {
  try {
    const { productId, operation, increment, count, price, deleteTrolley } =
      req.body;

    const saleOrderId = Number(req.params.id);

    const result = await prisma.$transaction([
      // // 修改出货单总价
      // prisma.ExportTrolley.update({
      //   where: {
      //     id: saleOrderId,
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
            prisma.saleOrderJoinProduct.create({
              data: {
                export: { connect: { id: saleOrderId } },
                product: { connect: { id: productId } },
                count,
                price,
              },
            }),
          ]
        : []),
      ...(operation === "update"
        ? [
            prisma.saleOrderJoinProduct.update({
              where: {
                saleOrderId_productId: {
                  saleOrderId,
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
            prisma.saleOrderJoinProduct.delete({
              where: {
                saleOrderId_productId: {
                  saleOrderId,
                  productId,
                },
              },
            }),
          ]
        : []),
      ...(operation === "delete" && deleteTrolley
        ? [
            prisma.saleOrder.delete({
              where: {
                id: saleOrderId,
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

// 更新出货单信息为发货，并更新相应辅助信息
export const updateSaleOrderStatus = async (req, rep) => {
  const saleOrderId = req.params.id;
  try {
    const { expressId, expressFee, expressNo, platformId, platformOrderNo } =
      req.body;
    await prisma.saleOrder.update({
      where: {
        id: Number(saleOrderId),
      },
      data: {
        expressId,
        expressFee,
        expressNo,
        platformId,
        platformOrderNo,
        status: "TO_RECEIVE",
      },
    });
    rep.send(getSuccessResp(null, "出货单更新成功"));
  } catch (error) {
    responseError(rep, error);
  }
};
