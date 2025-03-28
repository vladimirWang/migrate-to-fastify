import {
  getErrorResp,
  getSuccessResp,
  responseError,
} from "../utils/helper.js";
import { signToken } from "../utils/jwt.js";
import prisma from "../utils/prisma.js";
import _ from "lodash";

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
      //   .json({ msg: "用户名或密码错" });
      return;
    }
    const user = _.omit(result, "password");
    const token = signToken(user);
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
  const { username, password, email } = req.body;
  // const decodedPassword = decrypt(password);
  console.log("解密前: ", password);
  // console.log("解密后: ", decodedPassword);
  // 存入数据库为解密后的密码
  const result = await prisma.user.create({
    data: {
      // password: decodedPassword,
      password,
      username,
      email,
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
