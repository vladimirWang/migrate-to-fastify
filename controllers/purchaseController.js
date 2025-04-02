import prisma from "../utils/prisma.js";
import { responseError, getSuccessResp } from "../utils/helper.js";
import dayjs from "dayjs";
import _ from "lodash";

export const createPurchase = async (req, res) => {
  const {
    remark,
    products,
    purchaseDate,
    trolleyId,
    totalTrolley = false,
  } = req.body;

  //   return res.send("fff");

  const userId = req.user.id;
  try {
    const totalCost = products.reduce((a, c) => a + c.cost * c.count, 0);

    await prisma.$transaction([
      // (1) 创建purchase的对应记录，并插入productJoinPurchase
      prisma.purchase.create({
        data: {
          userId,
          remark,
          purchaseDate: new Date(purchaseDate),
          totalCost,
          productJoinPurchase: {
            create: products.map((product) => ({
              cost: product.cost,
              count: product.count,
              product: {
                connect: {
                  id: product.productId,
                },
              },
            })),
          },
        },
      }),
      // (2) 删除TrolleyJoinProduct表中的对应数据
      ...products.map((product) => {
        return prisma.trolleyJoinProduct.delete({
          where: {
            trolleyId_productId: {
              trolleyId,
              productId: product.productId,
            },
          },
        });
      }),
      // (3) 如用户提交了整个采购车，上述操作成功则删除采购车记录
      ...(totalTrolley
        ? [
            prisma.trolley.delete({
              where: { id: trolleyId },
            }),
          ]
        : []),
      // // (4) 更新采购车的总成本
      // ...(!totalTrolley
      //   ? [
      //       prisma.Trolley.update({
      //         where: { id: trolleyId },
      //         data: {
      //           totalCost: {
      //             increment: -1 * totalCost,
      //           },
      //         },
      //       }),
      //     ]
      //   : []),
    ]);
    res.send(getSuccessResp(null, "进货记录创建成功"));
  } catch (error) {
    responseError(res, error);
  }
};

// 获取按年分组的进货记录
export const getGroupedImports = async (req, res) => {
  try {
    const userId = req.user.id;
    const products = await prisma.purchase.findMany({
      where: {
        userId,
      },
    });

    const groupedJson = products.reduce((a, c) => {
      const { purchaseDate } = c;
      const formattedDate = dayjs(purchaseDate).format("YYYY-MM");

      if (a[formattedDate]) {
        a[formattedDate].push(c);
      } else {
        a[formattedDate] = [c];
      }
      return a;
    }, {});

    const groups = Object.keys(groupedJson).reduce((a, c) => {
      a.push({
        month: c,
        children: groupedJson[c],
      });
      return a;
    }, []);

    res.send(getSuccessResp(groups, "进货列表查询成功"));
  } catch (error) {
    responseError(res, error);
  }
};

// 商品批量进货
export const batchCreateImport = async (req, res) => {
  try {
    const { purchaseDate, products, remark } = req.body;

    const totalCost = products.reduce((a, c) => a + c.count * c.cost, 0);
    await prisma.purchase.create({
      data: {
        purchaseDate: new Date(purchaseDate),
        remark,
        totalCost,
        products: {
          create: products.map((product) => {
            return {
              vendorId: product.vendorId,
              latestCost: product.cost,
              count: product.count,
              productId: product.productId,
            };
          }),
        },
      },
    });
    // await prisma.$transaction;
    // prisma.
    // products.map((product) => {
    //   return prisma.Import.create({
    //     data: {
    //       ...product,
    //       purchaseDate,
    //     },
    //   });
    // })

    res.send(getSuccessResp(null, "进货记录批量创建成功"));
  } catch (error) {
    responseError(res, error);
  }
};

export const getImportDetail = async (req, res) => {
  const id = Number(req.params.id);
  try {
    const importDetail = await prisma.purchase.findUnique({
      where: {
        id,
      },
      include: {
        productJoinPurchase: {
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
    // const { productJoinImport, ...rest } = importDetail;

    res.send(getSuccessResp(importDetail, "进货记录详情查询成功"));
  } catch (error) {
    responseError(res, error);
  }
};

// 确认进货单状态为收到货
export const confirmPurchase = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const { confirmDate } = req.body;

    const productJoinImport = await prisma.productJoinPurchase.findMany({
      where: { purchaseId: id },
      select: {
        productId: true,
        count: true,
      },
    });

    const result = await prisma.$transaction([
      // 修改进货单状态，写入确认收货日期
      prisma.purchase.update({
        where: { id },
        data: {
          // confirmDate: new Date(confirmDate),
          confirmDate,
          purchaseStatus: "FINISHED",
        },
      }),

      // 修改商品库存
      ...productJoinImport.map((pji) => {
        return prisma.product.update({
          where: { id: pji.productId },
          data: {
            balance: {
              increment: pji.count,
            },
          },
        });
      }),
    ]);

    res.send(getSuccessResp(result, "进货单确认收货成功"));
  } catch (error) {
    responseError(res, error);
  }
};

// 撤销进货
/**
 * 把待确认的进货单删除，根据用户选择来是否要放回采购车
 */
export const revokePurchase = async (req, res) => {
  try {
    const userId = req.user.id;
    const { purchaseId, trolleyId } = req.body;
    // 当前进货单下的商品
    const curProductsInImport = await prisma.productJoinPurchase.findMany({
      where: {
        purchaseId,
      },
    });
    // 当前采购车中的商品
    let curProductsInTrolley = [];
    if (trolleyId) {
      curProductsInTrolley = await prisma.trolleyJoinProduct.findMany({
        where: {
          trolleyId,
        },
      });
    }

    // 把当前进货单的数组转换为以商品id为key的对象
    const importObj = curProductsInImport.reduce((a, c) => {
      a[c.productId] = c;
      return a;
    }, {});
    const importProductIds = _.map(curProductsInImport, "productId");
    const trolleyProductIds = _.map(curProductsInTrolley, "productId");

    // 取出进货单和采购车的交叉部分
    const intersectionProductIds = _.intersection(
      importProductIds,
      trolleyProductIds
    );
    // 进货单和交叉部分的difference就是采购车中不存在的商品
    const newComingProductIds = _.difference(
      importProductIds,
      intersectionProductIds
    );
    // 用交叉部分商品id遍历出已有商品的数据
    const existedData = intersectionProductIds.map((item) => importObj[item]);
    // 采购车中没有商品的数据
    const newComingData = newComingProductIds.map((item) => importObj[item]);
    // return res.send({
    //   importProductIds,
    //   trolleyProductIds,
    //   intersectionProductIds,
    //   newComingProductIds,
    //   importObj,
    //   intersectionData,
    //   newComingData,
    // });

    await prisma.$transaction(async (tx) => {
      // step1 删除中间表数据
      await Promise.all(
        importProductIds.map((item) => {
          return tx.productJoinPurchase.delete({
            where: {
              productId_importId: {
                purchaseId,
                productId: item,
              },
            },
          });
        })
      );
      // step2 把待确认的进货单删除，
      await tx.purchase.delete({
        where: {
          id: purchaseId,
        },
      });
      if (trolleyId) {
        // step3 根据用户选择来是否要放回采购车
        // step3-1 对已存在的商品增加数量
        await Promise.all(
          existedData.map((item) => {
            return prisma.trolleyJoinProduct.update({
              where: {
                trolleyId_productId: {
                  trolleyId,
                  productId: item.productId,
                },
              },
              data: {
                count: {
                  increment: item.count,
                },
              },
            });
          })
        );
        // step3-2 对不存在的商品插入数据
        await Promise.all(
          newComingData.map((item) => {
            return prisma.TrolleyJoinProduct.create({
              data: {
                trolleyId,
                productId: item.productId,
                count: item.count,
                cost: item.cost,
              },
            });
          })
        );
      } else {
        // step4 如果没有采购车的，根据商品新建采购车
        createMultiProductsTrolleyAction({
          products: curProductsInImport,
          idKey: "productId",
          userId,
        });
      }
    });
    res.send(getSuccessResp(null, "进货撤销成功"));
  } catch (error) {
    responseError(res, error);
  }
};
