import { fastify } from "../app.js";

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

export const authMiddleware = async (req, rep) => {
  try {
    const result = await req.jwtVerify();
    req.user = result;
  } catch (error) {
    // rep.code(500).send(error.message);
    console.log("--authMiddleware--: ", error.message);
    rep.code(401).send({ error: "token失效" });
  }
};
