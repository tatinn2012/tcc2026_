
import { z } from "zod";

const passwordSchema = z
  .string()
  .min(8, "A senha precisa ter pelo menos 8 caracteres.")
  .max(72, "A senha não pode ultrapassar 72 caracteres.")
  .refine(
    (password) => new TextEncoder().encode(password).length <= 72,
    "A senha ultrapassa o limite de bytes permitido."
  );

export const registerUserSchema = z.object({
  nome: z.string().trim().min(2).max(120),

  email: z
    .string()
    .trim()
    .email("E-mail inválido.")
    .max(255)
    .transform((email) => email.toLowerCase()),

  senha: passwordSchema,
}).strict();

export const loginUserSchema = z.object({
  email: z
    .string()
    .trim()
    .email()
    .transform((email) => email.toLowerCase()),

  senha: z.string().min(1).max(72),
}).strict();

export const updateUserSchema = z.object({
  nome: z.string().trim().min(2).max(120),
}).strict();

export type RegisterUserInput = z.infer<
  typeof registerUserSchema
>;

export type LoginUserInput = z.infer<
  typeof loginUserSchema
>;

export type UpdateUserInput = z.infer<
  typeof updateUserSchema
>;
