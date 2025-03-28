import prisma from "../utils/prisma.js";
import { z } from "zod";

// 定义登录请求体的 Zod 校验模式
const registerSchema = z.object({
  email: z.string().email().min(1, { message: "Email is required" }),
  username: z.string().min(1, { message: "Username is required" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" })
    .max(8, { message: "Password must be at most 8 characters" }),
});

export const loginValidator = async (req, reply) => {
  // const {username, password}
};

export const registerValidator = async (req, reply) => {
  //   const { username, password } = req.body;
  //   console.log(username, password, "--req.body");
  //   const result = await prisma.user.findFirst({
  //     where: { username },
  //   });
  //   console.log("---result---", result);

  try {
    const validatedData = registerSchema.parse(req.body);
    req.body = validatedData;
  } catch (error) {
    if (error instanceof z.ZodError) {
      reply
        .code(400)
        .send({ error: "Validation failed", issues: error.issues });
    } else {
      reply.code(500).send({ error: "Internal Server Error" });
    }
    throw new Error("validation failed");
  }
  //   throw new Error("fff");
};
