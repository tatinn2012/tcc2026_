import { sql } from "drizzle-orm";
import { pgTable, uuid, smallint, timestamp, uniqueIndex, index, check, foreignKey } from "drizzle-orm/pg-core";
import { maos } from "./maos";
import { jogadores } from "./jogadores";
import { teamSideEnum, trucoResponseEnum } from "./enums";

export const pedidosTruco = pgTable("pedidos_truco", {
  id: uuid("id").defaultRandom().primaryKey(),
  maoId: uuid("mao_id").notNull().references(() => maos.id, { onDelete: "cascade" }),
  sequencia: smallint("sequencia").notNull(),
  solicitanteJogadorId: uuid("solicitante_jogador_id").notNull().references(() => jogadores.id, { onDelete: "restrict" }),
  ladoSolicitante: teamSideEnum("lado_solicitante").notNull(),
  valorAnterior: smallint("valor_anterior").notNull(),
  valorSolicitado: smallint("valor_solicitado").notNull(),
  resposta: trucoResponseEnum("resposta").notNull().default("PENDING"),
  respondidoPorJogadorId: uuid("respondido_por_jogador_id").references(() => jogadores.id, { onDelete: "restrict" }),
  pedidoAnteriorId: uuid("pedido_anterior_id"),
  criadoEm: timestamp("criado_em", { withTimezone: true }).notNull().defaultNow(),
  respondidoEm: timestamp("respondido_em", { withTimezone: true }),
}, (table) => [
  foreignKey({ columns: [table.pedidoAnteriorId], foreignColumns: [table.id], name: "pedidos_truco_pedido_anterior_fk" }).onDelete("set null"),
  uniqueIndex("pedidos_truco_mao_sequencia_unique").on(table.maoId, table.sequencia),
  index("pedidos_truco_resposta_idx").on(table.resposta),
  check("pedidos_truco_sequencia_check", sql`${table.sequencia} >= 1`),
  check("pedidos_truco_valores_check", sql`${table.valorAnterior} IN (2, 4, 6, 10) AND ${table.valorSolicitado} IN (4, 6, 10, 12) AND ${table.valorSolicitado} > ${table.valorAnterior}`),
]);
