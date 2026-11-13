import { sql } from "drizzle-orm";
import { pgTable, uuid, smallint, timestamp, uniqueIndex, index, check } from "drizzle-orm/pg-core";
import { jogos } from "./jogos.js";
import { jogadores } from "./jogadores.js";
import { inscricoes } from "./inscricoes.js";
import { teamSideEnum, connectionStatusEnum } from "./enums.js";

export const jogoJogadores = pgTable("jogo_jogadores", {
  id: uuid("id").defaultRandom().primaryKey(),
  jogoId: uuid("jogo_id").notNull().references(() => jogos.id, { onDelete: "cascade" }),
  jogadorId: uuid("jogador_id").notNull().references(() => jogadores.id, { onDelete: "restrict" }),
  inscricaoId: uuid("inscricao_id").notNull().references(() => inscricoes.id, { onDelete: "restrict" }),
  assento: smallint("assento").notNull(), // 0, 1, 2 ou 3
  lado: teamSideEnum("lado").notNull(),
  conexao: connectionStatusEnum("conexao").notNull().default("OFFLINE"),
  ultimaAtividadeEm: timestamp("ultima_atividade_em", { withTimezone: true }),
  entrouEm: timestamp("entrou_em", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  uniqueIndex("jogo_jogadores_assento_unique").on(table.jogoId, table.assento),
  uniqueIndex("jogo_jogadores_jogador_unique").on(table.jogoId, table.jogadorId),
  index("jogo_jogadores_inscricao_idx").on(table.inscricaoId),
  check("jogo_jogadores_assento_check", sql`${table.assento} BETWEEN 0 AND 3`),
  check("jogo_jogadores_lado_assento_check", sql`(${table.assento} IN (0, 2) AND ${table.lado} = 'A') OR (${table.assento} IN (1, 3) AND ${table.lado} = 'B')`),
]);
