import { sql } from "drizzle-orm";
import { pgTable, uuid, smallint, timestamp, uniqueIndex, index, check } from "drizzle-orm/pg-core";
import { maos } from "./maos";
import { jogadores } from "./jogadores";
import { cartas } from "./cartas";

/** A tabela guarda a distribuição privada; não exponha consultas sem filtrar pelo jogador. */
export const cartasDistribuidas = pgTable("cartas_distribuidas", {
  id: uuid("id").defaultRandom().primaryKey(),
  maoId: uuid("mao_id").notNull().references(() => maos.id, { onDelete: "cascade" }),
  jogadorId: uuid("jogador_id").notNull().references(() => jogadores.id, { onDelete: "restrict" }),
  cartaId: smallint("carta_id").notNull().references(() => cartas.id, { onDelete: "restrict" }),
  ordemNaMao: smallint("ordem_na_mao").notNull(), // 1, 2 ou 3
  jogadaEm: timestamp("jogada_em", { withTimezone: true }),
  distribuidaEm: timestamp("distribuida_em", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  uniqueIndex("cartas_distribuidas_carta_por_mao_unique").on(table.maoId, table.cartaId),
  uniqueIndex("cartas_distribuidas_posicao_jogador_unique").on(table.maoId, table.jogadorId, table.ordemNaMao),
  index("cartas_distribuidas_jogador_idx").on(table.jogadorId),
  check("cartas_distribuidas_ordem_check", sql`${table.ordemNaMao} BETWEEN 1 AND 3`),
]);
