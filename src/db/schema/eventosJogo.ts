import { sql } from "drizzle-orm";
import { pgTable, uuid, integer, varchar, jsonb, timestamp, uniqueIndex, index, check } from "drizzle-orm/pg-core";
import { jogos } from "./jogos";
import { jogadores } from "./jogadores";
import { eventVisibilityEnum } from "./enums";
import type { JsonObject } from "./types";

/** Log imutável de eventos. Nunca envie privatePayload diretamente aos clientes. */
export const eventosJogo = pgTable("eventos_jogo", {
  id: uuid("id").defaultRandom().primaryKey(),
  jogoId: uuid("jogo_id").notNull().references(() => jogos.id, { onDelete: "restrict" }),
  sequencia: integer("sequencia").notNull(),
  jogadorId: uuid("jogador_id").references(() => jogadores.id, { onDelete: "set null" }),
  tipoEvento: varchar("tipo_evento", { length: 60 }).notNull(),
  visibilidade: eventVisibilityEnum("visibilidade").notNull().default("INTERNAL"),
  publicPayload: jsonb("public_payload").$type<JsonObject>().notNull().default(sql`'{}'::jsonb`),
  privatePayload: jsonb("private_payload").$type<JsonObject>(),
  criadoEm: timestamp("criado_em", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  uniqueIndex("eventos_jogo_sequencia_unique").on(table.jogoId, table.sequencia),
  index("eventos_jogo_tipo_idx").on(table.tipoEvento),
  check("eventos_jogo_sequencia_check", sql`${table.sequencia} >= 1`),
]);
