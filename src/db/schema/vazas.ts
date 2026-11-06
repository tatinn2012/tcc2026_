import { sql } from "drizzle-orm";
import { pgTable, uuid, smallint, timestamp, uniqueIndex, check } from "drizzle-orm/pg-core";
import { maos } from "./maos";
import { jogadores } from "./jogadores";
import { trickStatusEnum, trickWinnerSideEnum } from "./enums";

export const vazas = pgTable("vazas", {
  id: uuid("id").defaultRandom().primaryKey(),
  maoId: uuid("mao_id").notNull().references(() => maos.id, { onDelete: "cascade" }),
  numero: smallint("numero").notNull(), // 1, 2 ou 3
  jogadorInicialId: uuid("jogador_inicial_id").references(() => jogadores.id, { onDelete: "restrict" }),
  ladoVencedor: trickWinnerSideEnum("lado_vencedor"),
  status: trickStatusEnum("status").notNull().default("OPEN"),
  encerradaEm: timestamp("encerrada_em", { withTimezone: true }),
}, (table) => [
  uniqueIndex("vazas_mao_numero_unique").on(table.maoId, table.numero),
  check("vazas_numero_check", sql`${table.numero} BETWEEN 1 AND 3`),
]);
