import { pgTable, uuid, varchar, integer, boolean, jsonb, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { usuarios } from "./usuarios";
import type { TrucoRulesConfig } from "./types";

export const regrasTruco = pgTable("regras_truco", {
  id: uuid("id").defaultRandom().primaryKey(),
  nome: varchar("nome", { length: 100 }).notNull(),
  modalidade: varchar("modalidade", { length: 30 }).notNull().default("MINEIRO"),
  versao: integer("versao").notNull().default(1),
  configuracao: jsonb("configuracao").$type<TrucoRulesConfig>().notNull(),
  publicada: boolean("publicada").notNull().default(false),
  criadaPorUsuarioId: uuid("criada_por_usuario_id").references(() => usuarios.id, { onDelete: "set null" }),
  criadaEm: timestamp("criada_em", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [uniqueIndex("regras_truco_nome_versao_unique").on(table.nome, table.versao)]);
