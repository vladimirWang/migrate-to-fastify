import prisma from "../utils/prisma.js";
import { z } from "zod";
import { checkProductName, handleValidatorError } from "./helper.js";

export const productCreateValidator = async (req, rep) => {
  try {
    const schema = z
      .object({
        vendorId: z.number().positive(),
        name: z.string(),
      })
      .required();
    // req.body =
    schema.parse(req.body);
  } catch (error) {
    if (error instanceof z.ZodError) {
      rep.code(400).send({ error: "Validation failed", issues: error.issues });
      return;
    }
    rep.code(500).send({ error: error.message });
    return;
  }

  const productResult = await checkProductName(req.body);
  if (productResult) {
    rep.code(400).send({ error: "同一供应商下不能有多个产品拥有相同名称" });
  }
};

export const getProductByIdValidator = async (req, rep) => {
  const schema = z.string().regex(/^\d+$/);
  try {
    // const validatedData =
    schema.parse(req.params.id);
    // req.body = validatedData;
  } catch (error) {
    if (error instanceof z.ZodError) {
      rep.code(400).send({ error: "Validation failed", issues: error.issues });
      return;
    }
    rep.code(500).send({ error: error.message });
  }
};

export const updateProductValidator = async (req, rep) => {
  const paramSchema = z.string().regex(/^\d+$/);
  paramSchema.parse(req.params.id);
  const updateProductSchema = z
    .object({
      vendorId: z.number().positive(),
      name: z.string(),
      balance: z.number().positive(),
      cost: z.number().positive(),
      price: z.number().positive(),
    })
    .partial();
  try {
    updateProductSchema.parse(req.body);
  } catch (error) {
    handleValidatorError(rep, error);
    return;
  }
  const productResult = await checkProductName({
    name: req.body.name,
    vendorId: Number(req.params.id),
  });

  if (productResult) {
    rep.code(400).send({ error: "同一供应商下不能有多个产品拥有相同名称" });
  }
};
