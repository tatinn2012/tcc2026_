import { sql } from "drizzle-orm";
import { pgTable, uuid, smallint, boolean, timestamp, uniqueIndex, check, index } from "drizzle-orm/pg-core";
import { vazas } from "./vazas.js";
import { jogadores } from "./jogadores.js";
import { cartasDistribuidas } from "./cartasDistribuidas.js";

export const jogadasCartas = pgTable("jogadas_cartas", {
  id: uuid("id").defaultRandom().primaryKey(),
  vazaId: uuid("vaza_id").notNull().references(() => vazas.id, { onDelete: "cascade" }),
  jogadorId: uuid("jogador_id").notNull().references(() => jogadores.id, { onDelete: "restrict" }),
  cartaDistribuidaId: uuid("carta_distribuida_id").notNull().references(() => cartasDistribuidas.id, { onDelete: "restrict" }),
  ordemJogada: smallint("ordem_jogada").notNull(), // 1 a 4
  cartaCoberta: boolean("carta_coberta").notNull().default(false),
  jogadaEm: timestamp("jogada_em", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  uniqueIndex("jogadas_cartas_vaza_jogador_unique").on(table.vazaId, table.jogadorId),
  uniqueIndex("jogadas_cartas_vaza_ordem_unique").on(table.vazaId, table.ordemJogada),
  uniqueIndex("jogadas_cartas_carta_distribuida_unique").on(table.cartaDistribuidaId),
  index("jogadas_cartas_jogador_idx").on(table.jogadorId),
  check("jogadas_cartas_ordem_check", sql`${table.ordemJogada} BETWEEN 1 AND 4`),
]);
