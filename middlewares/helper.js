import { z } from "zod";

export const handleValidatorError = (rep, error) => {
  if (error instanceof z.ZodError) {
    rep.code(400).send({ error: "Validation failed", issues: error.issues });
  }
  rep.code(500).send({ error: error.message });
};
