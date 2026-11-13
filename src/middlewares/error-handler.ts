
import type { ErrorRequestHandler } from "express";

import { AppError } from "../shared/app-error.js";

export const errorHandler: ErrorRequestHandler = (
  error,
  _req,
  res,
  _next,
) => {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      error: error.code,
      message: error.message,
    });

    return;
  }

  console.error("[ERROR]", error);

  res.status(500).json({
    error: "INTERNAL_SERVER_ERROR",
    message: "Ocorreu um erro interno no servidor.",
  });
};
