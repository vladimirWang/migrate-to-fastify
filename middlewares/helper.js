import { z } from "zod";
import prisma from "../utils/prisma.js";

export const handleValidatorError = (rep, error) => {
  if (error instanceof z.ZodError) {
    rep.code(400).send({ error: "Validation failed", issues: error.issues });
  }
  rep.code(500).send({ error: error.message });
};

export const checkProductName = async (data) => {
  const { vendorId, name } = data;

  const productResult = await prisma.product.findFirst({
    where: {
      name: name,
      vendorId,
    },
  });
  console.log(body, productResult, "---body---");
  return productResult;
};
