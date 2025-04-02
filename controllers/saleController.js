import { getSuccessResp, responseError } from "../utils/helper.js";
import prisma from "../utils/prisma.js";

export const createSale = async (req, rep) => {
  const userId = req.user.id;
  const {
    purchaseDate,
    platform,
    platformOrderNo,
    clientId,
    remark,
    products,
    saleTrolleyId,
  } = req.body;
  try {
    const totalPrice = products.reduce((a, c) => {
      return getSum(a, c.price * c.count);
    }, 0);
    const result = await prisma.$transaction([
      // 生成出货记录
      prisma.sale.create({
        data: {
          purchaseDate: purchaseDate ? new Date(purchaseDate) : undefined,
          platform,
          platformOrderNo,
          // client: {
          //   connect: clientId,
          // },
          totalPrice,
          remark,
          createdUser: {
            connect: {
              id: userId,
            },
          },
          saleJoinProduct: {
            create: products.map((product) => {
              return {
                productId: product.productId,
                price: product.price,
                count: product.count,
              };
            }),
          },
        },
      }),
      // 删除待出货的中间表数据
      ...(Array.isArray(products)
        ? products.map((product) => {
            return prisma.saleTrolleyJoinProduct.delete({
              where: {
                saleTrolleyId_productId: {
                  saleTrolleyId: saleTrolleyId,
                  productId: product.productId,
                },
              },
            });
          })
        : []),
      //  删除待出货的对应记录
      prisma.saleTrolley.delete({
        where: {
          id: saleTrolleyId,
        },
      }),
      // 修改产品库存
      ...(Array.isArray(products)
        ? products.map((product) => {
            return prisma.product.update({
              where: {
                id: product.productId,
              },
              data: {
                balance: {
                  decrement: product.count,
                },
              },
            });
          })
        : []),
    ]);
    res.json({ msg: "出货单创建成功", data: result });
  } catch (error) {
    responseError(rep, error);
  }
};
