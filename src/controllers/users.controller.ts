
import type { RequestHandler } from "express";

import { AppError } from "../shared/app-error.js";

import * as usersService from "../services/users.service.js";

import type {
  RegisterUserInput,
  LoginUserInput,
  UpdateUserInput,
} from "../validators/users.validation.js";

export const register: RequestHandler = async (req, res) => {
  const result = await usersService.register(
    req.body as RegisterUserInput
  );

  res.status(201).json({
    message: "Usuário cadastrado com sucesso.",
    ...result,
  });
};

export const login: RequestHandler = async (req, res) => {
  const result = await usersService.login(
    req.body as LoginUserInput
  );

  res.status(200).json({
    message: "Login realizado com sucesso.",
    ...result,
  });
};

export const getMe: RequestHandler = async (req, res) => {
  const userId = req.authUser?.id;

  if (!userId) {
    throw new AppError(
      401,
      "Autenticação necessária.",
      "UNAUTHORIZED"
    );
  }

  const user = await usersService.getProfile(userId);

  res.status(200).json({ user });
};

export const updateMe: RequestHandler = async (req, res) => {
  const userId = req.authUser?.id;

  if (!userId) {
    throw new AppError(
      401,
      "Autenticação necessária.",
      "UNAUTHORIZED"
    );
  }

  const user = await usersService.updateProfile(
    userId,
    req.body as UpdateUserInput
  );

  res.status(200).json({
    message: "Perfil atualizado com sucesso.",
    user,
  });
};
