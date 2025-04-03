import { getSuccessResp, responseError } from "../utils/helper.js";
import prisma from "../utils/prisma.js";
import { sum } from "../utils/helper.js";

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
      await tx.sale.create({
        data: {
          // purchaseDate: purchaseDate ? new Date(purchaseDate) : undefined,
          purchaseDate: new Date(),
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
          express: {
            connect: {
              id: expressId,
            },
          },
          expressNo,
          expressFee,
          platform: {
            connect: {
              id: platformId,
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
      await tx.saleTrolley.delete({
        where: {
          id: saleTrolleyId,
        },
      });
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
