import { sql } from "drizzle-orm";
import { pgTable, uuid, integer, smallint, timestamp, uniqueIndex, check, index } from "drizzle-orm/pg-core";
import { jogos } from "./jogos";
import { jogadores } from "./jogadores";
import { roundStatusEnum, handModeEnum, teamSideEnum } from "./enums";

export const maos = pgTable("maos", {
  id: uuid("id").defaultRandom().primaryKey(),
  jogoId: uuid("jogo_id").notNull().references(() => jogos.id, { onDelete: "cascade" }),
  numero: integer("numero").notNull(),
  distribuidorJogadorId: uuid("distribuidor_jogador_id").references(() => jogadores.id, { onDelete: "restrict" }),
  primeiroJogadorId: uuid("primeiro_jogador_id").references(() => jogadores.id, { onDelete: "restrict" }),
  jogadorDaVezId: uuid("jogador_da_vez_id").references(() => jogadores.id, { onDelete: "restrict" }),
  modo: handModeEnum("modo").notNull().default("NORMAL"),
  valorAtual: smallint("valor_atual").notNull().default(2),
  status: roundStatusEnum("status").notNull().default("IN_PROGRESS"),
  ladoVencedor: teamSideEnum("lado_vencedor"),
  iniciadaEm: timestamp("iniciada_em", { withTimezone: true }).notNull().defaultNow(),
  encerradaEm: timestamp("encerrada_em", { withTimezone: true }),
}, (table) => [
  uniqueIndex("maos_jogo_numero_unique").on(table.jogoId, table.numero),
  index("maos_status_idx").on(table.status),
  check("maos_numero_check", sql`${table.numero} >= 1`),
  check("maos_valor_check", sql`${table.valorAtual} IN (2, 4, 6, 10, 12)`),
]);
