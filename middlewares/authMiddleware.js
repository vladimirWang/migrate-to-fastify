// import { fastify } from "../app.js";

// export const authMiddleware = async (req, res, next) => {
//   if (!req.headers.authorization) {
//     res.status(401).json({ error: "token失效" });
//     return;
//   }
//   const token = req.headers.authorization.substr("Bearer ".length);
//   if (!token) {
//     res.status(401).json({ error: "token失效" });
//     return;
//   }
//   try {
//     const result = await verifyToken(token);
//     req.user = result;
//     next();
//   } catch (error) {
//     res.status(401).json({ error: "token失效" });
//     return;
//   }
// };

const exclude = ["/api/user/login", "/api/user/register"];
export const authMiddleware = async (req, rep) => {
  if (exclude.includes(req.url)) {
    return;
  }

  try {
    const result = await req.jwtVerify();
    req.user = result;
  } catch (error) {
    rep.code(401).send({ error: error.message });
  }
};
