import prisma from "../utils/prisma.js";
import { z } from "zod";
import { handleValidatorError } from "./helper.js";

// 定义登录请求体的 Zod 校验模式

export const loginValidator = async (req, rep) => {
  const loginSchema = z
    .object({
      username: z.string(),
      password: z.string(),
    })
    .required();
  try {
    loginSchema.parse(req.body);
  } catch (error) {
    handleValidatorError(rep, error);
  }
};

export const registerValidator = async (req, rep) => {
  const registerSchema = z.object({
    // email: z.string().email().min(1, { message: "Email is required" }),
    username: z.string().min(1, { message: "Username is required" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" })
      .max(8, { message: "Password must be at most 8 characters" }),
  });
  try {
    const validatedData = registerSchema.parse(req.body);
    req.body = validatedData;
  } catch (error) {
    handleValidatorError(rep, error);
  }

  const { username, email } = req.body;
  const result = await prisma.user.findFirst({
    where: {
      OR: [
        {
          username,
        },
        // {
        //   email,
        // },
      ],
    },
  });
  console.log("用户注册校验: ", result);
  if (result) {
    rep.code(400).send({ error: "用户名或邮箱已存在" });
  }
};
