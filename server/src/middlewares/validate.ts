// middlewares/validate.ts
import type { Request, Response, NextFunction } from "express";
import type { ZodSchema } from "zod";

export const validate = (schema: ZodSchema) => {
  // console.log("Validating schema:", schema);
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      console.error("Validation error:", result.error.flatten());
      res.status(400).json({ error: result.error.flatten() });
      return;
    }
    req.body = result.data;
    console.log("Validated data:", req.body);
    next();
  };
};
