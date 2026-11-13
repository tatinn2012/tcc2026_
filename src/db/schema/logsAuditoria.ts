import { pgTable, uuid, varchar, jsonb, timestamp, index } from "drizzle-orm/pg-core";
import { usuarios } from "./usuarios.js";
import type { JsonObject } from "./types.js";

/** Auditoria administrativa genérica. entityId é polimórfico e não possui FK. */
export const logsAuditoria = pgTable("logs_auditoria", {
  id: uuid("id").defaultRandom().primaryKey(),
  atorUsuarioId: uuid("ator_usuario_id").references(() => usuarios.id, { onDelete: "set null" }),
  acao: varchar("acao", { length: 40 }).notNull(),
  tipoEntidade: varchar("tipo_entidade", { length: 60 }).notNull(),
  entidadeId: uuid("entidade_id").notNull(),
  dadosAnteriores: jsonb("dados_anteriores").$type<JsonObject>(),
  dadosNovos: jsonb("dados_novos").$type<JsonObject>(),
  criadoEm: timestamp("criado_em", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  index("logs_auditoria_ator_idx").on(table.atorUsuarioId),
  index("logs_auditoria_entidade_idx").on(table.tipoEntidade, table.entidadeId),
  index("logs_auditoria_criado_idx").on(table.criadoEm),
]);
