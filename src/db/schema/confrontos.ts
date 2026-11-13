import { sql } from "drizzle-orm";
import { pgTable, uuid, integer, smallint, timestamp, uniqueIndex, index, check } from "drizzle-orm/pg-core";
import { fases } from "./fases.js";
import { inscricoes } from "./inscricoes.js";
import { confrontationStatusEnum } from "./enums.js";

/** Disputa entre duas inscrições no chaveamento; pode conter vários jogos de truco. */
export const confrontos = pgTable("confrontos", {
  id: uuid("id").defaultRandom().primaryKey(),
  faseId: uuid("fase_id").notNull().references(() => fases.id, { onDelete: "cascade" }),
  numero: integer("numero").notNull(),
  status: confrontationStatusEnum("status").notNull().default("PENDING"),
  melhorDe: smallint("melhor_de").notNull().default(1),
  vitoriasNecessarias: smallint("vitorias_necessarias").notNull().default(1),
  vitoriasLadoA: smallint("vitorias_lado_a").notNull().default(0),
  vitoriasLadoB: smallint("vitorias_lado_b").notNull().default(0),
  vencedoraInscricaoId: uuid("vencedora_inscricao_id").references(() => inscricoes.id, { onDelete: "restrict" }),
  agendadoEm: timestamp("agendado_em", { withTimezone: true }),
  iniciadoEm: timestamp("iniciado_em", { withTimezone: true }),
  finalizadoEm: timestamp("finalizado_em", { withTimezone: true }),
}, (table) => [
  uniqueIndex("confrontos_fase_numero_unique").on(table.faseId, table.numero),
  index("confrontos_status_idx").on(table.status),
  check("confrontos_numero_check", sql`${table.numero} >= 1`),
  check("confrontos_melhor_de_check", sql`${table.melhorDe} >= 1 AND ${table.melhorDe} % 2 = 1`),
  check("confrontos_vitorias_check", sql`${table.vitoriasNecessarias} >= 1 AND ${table.vitoriasLadoA} >= 0 AND ${table.vitoriasLadoB} >= 0`),
]);
