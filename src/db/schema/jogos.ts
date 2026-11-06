import { sql } from "drizzle-orm";
import { pgTable, uuid, integer, smallint, jsonb, timestamp, uniqueIndex, check, index } from "drizzle-orm/pg-core";
import { confrontos } from "./confrontos";
import { regrasTruco } from "./regrasTruco";
import { gameStatusEnum } from "./enums";
import type { TrucoRulesConfig } from "./types";

/** Uma partida digital dentro de um confronto. O snapshot congela as regras usadas. */
export const jogos = pgTable("jogos", {
  id: uuid("id").defaultRandom().primaryKey(),
  confrontoId: uuid("confronto_id").notNull().references(() => confrontos.id, { onDelete: "restrict" }),
  numero: smallint("numero").notNull(),
  regrasId: uuid("regras_id").notNull().references(() => regrasTruco.id, { onDelete: "restrict" }),
  snapshotRegras: jsonb("snapshot_regras").$type<TrucoRulesConfig>().notNull(),
  status: gameStatusEnum("status").notNull().default("WAITING"),
  pontosLadoA: smallint("pontos_lado_a").notNull().default(0),
  pontosLadoB: smallint("pontos_lado_b").notNull().default(0),
  versaoEstado: integer("versao_estado").notNull().default(0),
  iniciadaEm: timestamp("iniciada_em", { withTimezone: true }),
  finalizadaEm: timestamp("finalizada_em", { withTimezone: true }),
  criadaEm: timestamp("criada_em", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  uniqueIndex("jogos_confronto_numero_unique").on(table.confrontoId, table.numero),
  index("jogos_status_idx").on(table.status),
  check("jogos_numero_check", sql`${table.numero} >= 1`),
  check("jogos_pontuacao_check", sql`${table.pontosLadoA} >= 0 AND ${table.pontosLadoB} >= 0`),
  check("jogos_versao_check", sql`${table.versaoEstado} >= 0`),
]);
