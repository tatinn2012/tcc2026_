
import { Router } from "express";

import {
  register,
  login,
  getMe,
  updateMe,
} from "../controllers/users.controller.js";

import { authenticate } from "../middlewares/authenticate.js";
import { validateBody } from "../middlewares/validate.js";

import {
  registerUserSchema,
  loginUserSchema,
  updateUserSchema,
} from "../validators/users.validation.js";

const router = Router();

// Cadastro
router.post(
  "/register",
  validateBody(registerUserSchema),
  register
);

// Login
router.post(
  "/login",
  validateBody(loginUserSchema),
  login
);

// Consultar o próprio perfil
router.get(
  "/me",
  authenticate,
  getMe
);

// Atualizar o próprio perfil
router.patch(
  "/me",
  authenticate,
  validateBody(updateUserSchema),
  updateMe
);

export default router;
