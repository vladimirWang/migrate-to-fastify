import { PrismaClient } from "@prisma/client";

const { DATABASE_URL, HOST } = process.env;

const options = {
  log: ["info", "error"],
  datasources: {
    db: {
      url: DATABASE_URL,
    },
  },
  omit: {
    user: {
      password: true,
    },
  },
};
/**
 * data 是数据库记录
 * @param {*} key model中图片是哪个字段
 * @returns 包含协议域名的完整路径
 */
const getFullImg =
  (key = "img") =>
  (data) =>
    data[key] ? `${HOST}/static/${data[key]}` : null;

const extensions = {
  result: {
    vendor: {
      fullImg: {
        needs: { img: true },
        compute: getFullImg(),
      },
    },
    user: {
      fullAvatar: {
        needs: { avatar: true },
        compute: getFullImg("avatar"),
      },
    },
    product: {
      fullImg: {
        needs: { img: true },
        compute(vendor) {
          if (!vendor.img || typeof vendor.img !== "string") return [];
          const imgArr = vendor.img.split(",").map((img) => {
            return `${HOST}/static/${img}`;
          });
          return imgArr;
        },
      },
    },
  },
};
let prismaClient;

if (process.env.NODE_ENV === "development") {
  prismaClient = new PrismaClient(options).$extends(extensions);
} else {
  if (!global.cachedPrisma) {
    global.cachedPrisma = new PrismaClient(options).$extends(extensions);
  }
  prismaClient = global.cachedPrisma;
}

export default prismaClient;
