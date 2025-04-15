import prisma from "../utils/prisma.js";
import {
  getErrorResp,
  getSuccessResp,
  responseError,
  groupsByVendorId,
} from "../utils/helper.js";

// 新建采购车
export const createTrolley = async (req, res) => {
  const { cost, count, productId } = req.body;

  // return res.send({ mg: "ok", cost, count, productId });
  try {
    const userId = req.user.id;
    const resp = await prisma.trolley.create({
      data: {
        // userId,
        user: { connect: { id: userId } },
        // totalCost: cost * count,
        trolleyJoinProduct: {
          create: [
            {
              count,
              cost,
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
    res.send(getSuccessResp(resp, "采购车创建成功"));
  } catch (error) {
    responseError(res, error);
  }
};

// 更新采购车
export const updateTrolley = async (req, res) => {
  const {
    cost,
    count, // 直接修改为新数量时用到,删除多个则传负值
    productId,
    vendorId,
    operation, // create 购物车中原本没有这个商品，update：在已有的商品个数上修改；删除购物车中已存在的商品
    increment, // 数字，只有operation为update时用到，增减的具体数量
    deleteTrolley,
  } = req.body;
  try {
    const trolleyId = parseInt(req.params.id);

    if (isNaN(trolleyId)) {
      res.status(400).json({
        msg: "采购车不存在",
        success: false,
      });
      return;
    }
    let newTotalExpression;
    if (operation === "delete") {
      newTotalExpression = {
        increment: cost * count,
      };
    } else if (operation === "create") {
      newTotalExpression = {
        increment: cost * count,
      };
    } else if (operation === "update") {
      if (increment === undefined) {
        res.send(
          getErrorResp("参数错误: operation为update时，必传incrementOne")
        );
        return;
      }
      newTotalExpression = {
        increment: cost * increment,
      };
    }

    await prisma.$transaction([
      // // 更新采购车表
      // prisma.Trolley.update({
      //   where: {
      //     id: trolleyId,
      //   },
      //   data: {
      //     // totalPrice: 400,
      //     // totalCost: newTotalExpression,
      //   },
      // }),
      // 采购车中加入了新的商品
      ...(operation === "create"
        ? [
            prisma.trolleyJoinProduct.create({
              data: {
                trolley: { connect: { id: trolleyId } },
                product: { connect: { id: productId } },
                count,
                cost,
              },
            }),
          ]
        : []),
      // 对采购车原有的商品数量调整
      ...(operation === "update"
        ? [
            prisma.trolleyJoinProduct.update({
              where: {
                trolleyId_productId: {
                  trolleyId,
                  productId,
                },
              },
              data: {
                count: {
                  increment,
                },
                cost,
              },
            }),
          ]
        : []),
      // 删除采购车中已有商品
      ...(operation === "delete"
        ? [
            prisma.trolleyJoinProduct.delete({
              where: {
                trolleyId_productId: {
                  trolleyId,
                  productId,
                },
              },
            }),
          ]
        : []),
      // 如果采购车下都空了，就删除采购车这条数据
      ...(deleteTrolley
        ? [
            prisma.trolley.delete({
              where: {
                id: trolleyId,
              },
            }),
          ]
        : []),
    ]);
    res.send(getSuccessResp(null, "采购车更新成功"));
  } catch (error) {
    responseError(res, error);
  }
};

// 获取当前采购车详情
export const getCurrentUserTrolleyDetail = async (req, res) => {
  try {
    const userId = req.user.id;

    const trolley = await prisma.trolley.findFirst({
      where: { userId },
      include: {
        trolleyJoinProduct: {
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
    if (trolley === null) {
      res.send(getSuccessResp(null, "获取采购车数据成功"));
      return;
    }

    // 把供应商的数据提到最上层, 便于后续按供应商分组
    let converted = [];
    if (Array.isArray(trolley?.trolleyJoinProduct)) {
      converted = trolley.trolleyJoinProduct.reduce((a, c) => {
        a = a.concat({
          ...c,
          // 把供应商的数据提到最上层, 便于后续按供应商分组
          vendor: c?.product?.vendor,
        });

        return a;
      }, []);
    }

    let temp = groupsByVendorId(converted);
    trolley.trolleyJoinProduct = temp;
    res.send(getSuccessResp(trolley, "获取采购车详情成功"));
  } catch (error) {
    console.error("error", error.message);
    responseError(res, error);
  }
};

// 这个商品在采购车中是否存在
export const productIsExistedInTrolley = async (req, res) => {
  try {
    const trolleyId = req.params.id;
    const productId = req.params.productId;
    const trolleyDetail = await prisma.trolleyJoinProduct.findUnique({
      where: {
        trolleyId_productId: {
          trolleyId: Number(trolleyId),
          productId: Number(productId),
        },
      },
    });
    res.send(getSuccessResp(trolleyDetail, "采购车中的商品查询成功"));
  } catch (error) {
    responseError(res, error);
  }
};

// 当删除采购车里所有商品时，同时删除采购车
export const deleteTrolleyById = async (req, res) => {
  try {
    const trolleyId = Number(req.params.id);
    const productId = Number(req.query.productId);
    // console.log(prisma.Trolley.delete);
    await prisma.$transaction([
      prisma.trolleyJoinProduct.delete({
        where: {
          trolleyId_productId: {
            productId,
            trolleyId,
          },
        },
      }),
      prisma.trolley.delete({
        where: { id: trolleyId },
      }),
    ]);
    res.send(getSuccessResp(null, "采购车已删除"));
  } catch (error) {
    responseError(res, error);
  }
};
