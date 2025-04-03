import {
  getErrorResp,
  getSuccessResp,
  responseError,
} from "../utils/helper.js";
import { signToken } from "../utils/jwt.js";
import prisma from "../utils/prisma.js";
import _ from "lodash";
import { fastify } from "../app.js";

export const userLogin = async (req, rep) => {
  const { password, username } = req.body;
  try {
    const result = await prisma.user.findFirst({
      where: {
        // password: decodedPassword,
        password,
        // email,
        username,
      },
    });
    if (!result) {
      rep.code(402).send(getErrorResp("用户名或密码错"));
      return;
    }
    const user = _.omit(result, "password");
    const token = fastify.jwt.sign(user);
    return getSuccessResp({ token }, "用户登录成功");
  } catch (error) {
    responseError(rep, error);
  }
  // .then((result) => {

  //   res.json(getSuccessResp({ token }, "用户登录成功"));
  // })
  // .catch((err) => {
  //   responseError(res, err);
  // });
};

export const userRegister = async (req, rep) => {
  // 对密码解密
  const { username, password } = req.body;
  // const decodedPassword = decrypt(password);
  console.log("解密前: ", password);
  // console.log("解密后: ", decodedPassword);
  // 存入数据库为解密后的密码
  const result = await prisma.user.create({
    data: {
      // password: decodedPassword,
      password,
      username,
      // email,
    },
  });

  console.log("result: ", result);
  return { msg: "success" };
  // .then((result) => {
  //   res.json(getSuccessResp(null, "用户注册成功"));
  // })
  // .catch((err) => {
  //   responseError(res, err);
  // });
};

export const getCurrentUser = async (req, rep) => {
  const userId = req.user.id;
  if (!userId) {
    rep.code(401).send({ error: "token失效" });
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        trolley: {
          include: {
            trolleyJoinProduct: true,
          },
        },
      },
    });
    if (!user) {
      rep.code(404).send(getErrorResp("没有查询到用户"));
      return;
    }
    const userData = _.omit(user, [
      "exp",
      "iat",
      "createdAt",
      "updatedAt",
      "trolley",
    ]);

    const trolley =
      Array.isArray(user.trolley) && user.trolley.length
        ? user.trolley[0]
        : null;

    rep.send(
      getSuccessResp(
        {
          userInfo: userData,
          trolleyInfo: trolley
            ? {
                id: trolley.id,
                totalPrice: trolley.totalPrice,
                trolleyJoinProduct: trolley.trolleyJoinProduct,
              }
            : undefined,
        },
        "获取当前用户信息成功"
      )
    );
  } catch (error) {
    responseError(rep, error);
  }
};

export const updateUser = async (req, rep) => {
  const userId = req.user.id;
  const { avatar, username, email, password } = req.body;
  try {
    await prisma.user.update({
      where: { id: userId },
      data: { avatar, username, email, password },
    });

    rep.send(getSuccessResp(null, "用户信息更新成功"));
  } catch (error) {
    responseError(rep, error);
  }
};
