
import bcrypt from "bcryptjs";

import { AppError } from "../shared/app-error.js";
import { createAccessToken } from "../shared/jwt.js";

import * as usersRepository from "../repositories/users.repository.js";

import type {
  RegisterUserInput,
  LoginUserInput,
  UpdateUserInput,
} from "../validators/users.validation.js";

import { usuarios } from "../db/schema/usuarios.js";

type UserRecord = typeof usuarios.$inferSelect;

type PublicUser = Omit<UserRecord, "senhaHash">;

function toPublicUser(user: UserRecord): PublicUser {
  const { senhaHash: _senhaHash, ...publicUser } = user;

  return publicUser;
}

function isUniqueViolation(error: unknown): boolean {
  if (typeof error !== "object" || error === null) {
    return false;
  }

  const candidate = error as {
    code?: string;
    cause?: unknown;
  };

  return (
    candidate.code === "23505" ||
    isUniqueViolation(candidate.cause)
  );
}

export async function register(input: RegisterUserInput) {
  const email = input.email.toLowerCase();

  const existingUser = await usersRepository.findByEmail(email);

  if (existingUser) {
    throw new AppError(
      409,
      "Este e-mail já está cadastrado.",
      "EMAIL_ALREADY_EXISTS"
    );
  }

  const senhaHash = await bcrypt.hash(input.senha, 12);

  try {
    const user = await usersRepository.create({
      nome: input.nome,
      email,
      senhaHash,
    });

    const token = await createAccessToken(user.id);

    return {
      user: toPublicUser(user),
      token,
    };
  } catch (error) {
    if (isUniqueViolation(error)) {
      throw new AppError(
        409,
        "Este e-mail já está cadastrado.",
        "EMAIL_ALREADY_EXISTS"
      );
    }

    throw error;
  }
}

export async function login(input: LoginUserInput) {
  const user = await usersRepository.findByEmail(
    input.email.toLowerCase()
  );

  if (!user || !user.senhaHash) {
    throw new AppError(
      401,
      "E-mail ou senha incorretos.",
      "INVALID_CREDENTIALS"
    );
  }

  const passwordMatches = await bcrypt.compare(
    input.senha,
    user.senhaHash
  );

  if (!passwordMatches) {
    throw new AppError(
      401,
      "E-mail ou senha incorretos.",
      "INVALID_CREDENTIALS"
    );
  }

  if (user.status === "BLOCKED") {
    throw new AppError(
      403,
      "Esta conta está bloqueada.",
      "ACCOUNT_BLOCKED"
    );
  }

  if (user.status !== "ACTIVE") {
    throw new AppError(
      403,
      "Esta conta ainda não está ativa.",
      "ACCOUNT_NOT_ACTIVE"
    );
  }

  const token = await createAccessToken(user.id);

  return {
    user: toPublicUser(user),
    token,
  };
}

export async function getProfile(userId: string) {
  const user = await usersRepository.findById(userId);

  if (!user) {
    throw new AppError(
      404,
      "Usuário não encontrado.",
      "USER_NOT_FOUND"
    );
  }

  return toPublicUser(user);
}

export async function updateProfile(
  userId: string,
  input: UpdateUserInput
) {
  const user = await usersRepository.updateName(
    userId,
    input.nome
  );

  if (!user) {
    throw new AppError(
      404,
      "Usuário não encontrado.",
      "USER_NOT_FOUND"
    );
  }

  return toPublicUser(user);
}
