
import { z } from "zod";
import { teamMemberRoleEnum } from "../db/schema/enums.js";

// Criação de perfil de jogador
export const createPlayerSchema = z.object({
  apelido: z.string().trim().min(2).max(60),

  fotoUrl: z.string().trim().max(2048).nullable().optional(),

  cidade: z.string().trim().max(100).nullable().optional(),

  estado: z
    .string()
    .trim()
    .length(2)
    .transform((value) => value.toUpperCase())
    .nullable()
    .optional(),
}).strict();

// Atualização do próprio perfil
export const updatePlayerSchema = createPlayerSchema
  .partial()
  .refine(
    (data) => Object.values(data).some((value) => value !== undefined),
    "Informe pelo menos um campo para atualizar."
  );

// Integrante da dupla
const duoMemberSchema = z.object({
  jogadorId: z.string().uuid(),

  papel: z.enum(teamMemberRoleEnum.enumValues),
}).strict();

// Validação dos dois integrantes
const duoMembersSchema = z
  .array(duoMemberSchema)
  .length(2, "Uma dupla precisa ter exatamente dois jogadores.")
  .superRefine((members, ctx) => {
    const playerIds = members.map((member) => member.jogadorId);
    const roles = members.map((member) => member.papel);

    if (new Set(playerIds).size !== 2) {
      ctx.addIssue({
        code: "custom",
        message: "Não é permitido adicionar o mesmo jogador duas vezes.",
      });
    }

    if (new Set(roles).size !== 2) {
      ctx.addIssue({
        code: "custom",
        message: "Cada jogador precisa ocupar um papel diferente.",
      });
    }
  });

// Criação de dupla
export const createDuoSchema = z.object({
  nome: z.string().trim().min(2).max(80),

  jogadores: duoMembersSchema,
}).strict();

// Atualização do nome
export const updateDuoSchema = z.object({
  nome: z.string().trim().min(2).max(80),
}).strict();

// Substituição da composição da dupla
export const replaceDuoMembersSchema = z.object({
  jogadores: duoMembersSchema,
}).strict();

// Parâmetro UUID
export const idParamSchema = z.object({
  id: z.string().uuid(),
});

// Paginação
export const listParticipantsQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),

  limit: z.coerce.number().int().min(1).max(100).default(20),

  search: z.string().trim().min(1).max(80).optional(),
});

// Tipos derivados dos schemas
export type CreatePlayerInput = z.infer<typeof createPlayerSchema>;

export type UpdatePlayerInput = z.infer<typeof updatePlayerSchema>;

export type CreateDuoInput = z.infer<typeof createDuoSchema>;

export type UpdateDuoInput = z.infer<typeof updateDuoSchema>;

export type ReplaceDuoMembersInput = z.infer<
  typeof replaceDuoMembersSchema
>;
