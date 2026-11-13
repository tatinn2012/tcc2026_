
import type { RequestHandler } from "express";
import type { ZodType } from "zod";

export function validateBody(
  schema: ZodType
): RequestHandler {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      res.status(400).json({
        error: "VALIDATION_ERROR",
        message: "Os dados enviados são inválidos.",
        details: result.error.issues.map((issue) => ({
          campo: issue.path.join("."),
          mensagem: issue.message,
        })),
      });

      return;
    }

    req.body = result.data;

    next();
  };
}
