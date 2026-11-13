import { pgTable, uuid, timestamp, primaryKey, uniqueIndex, index } from "drizzle-orm/pg-core";
import { duplas } from "./duplas.js";
import { jogadores } from "./jogadores.js";
import { teamMemberRoleEnum } from "./enums.js";

/** Composição atual da dupla. A inscrição também salva uma escalação histórica. */
export const duplaJogadores = pgTable("dupla_jogadores", {
  duplaId: uuid("dupla_id").notNull().references(() => duplas.id, { onDelete: "cascade" }),
  jogadorId: uuid("jogador_id").notNull().references(() => jogadores.id, { onDelete: "restrict" }),
  papel: teamMemberRoleEnum("papel").notNull(),
  adicionadoEm: timestamp("adicionado_em", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  primaryKey({ columns: [table.duplaId, table.jogadorId] }),
  uniqueIndex("dupla_jogadores_papel_unique").on(table.duplaId, table.papel),
  index("dupla_jogadores_jogador_idx").on(table.jogadorId),
]);
