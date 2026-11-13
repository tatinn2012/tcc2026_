import { sql } from "drizzle-orm";
import { pgTable, uuid, smallint, timestamp, primaryKey, uniqueIndex, check, index } from "drizzle-orm/pg-core";
import { inscricoes } from "./inscricoes.js";
import { jogadores } from "./jogadores.js";
/** Snapshot dos dois jogadores que efetivamente representarão a dupla no torneio. */
export const inscricaoJogadores = pgTable("inscricao_jogadores", {
    inscricaoId: uuid("inscricao_id").notNull().references(() => inscricoes.id, { onDelete: "cascade" }),
    jogadorId: uuid("jogador_id").notNull().references(() => jogadores.id, { onDelete: "restrict" }),
    posicao: smallint("posicao").notNull(), // 1 ou 2
    escaladoEm: timestamp("escalado_em", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
    primaryKey({ columns: [table.inscricaoId, table.jogadorId] }),
    uniqueIndex("inscricao_jogadores_posicao_unique").on(table.inscricaoId, table.posicao),
    index("inscricao_jogadores_jogador_idx").on(table.jogadorId),
    check("inscricao_jogadores_posicao_check", sql `${table.posicao} IN (1, 2)`),
]);
//# sourceMappingURL=inscricaoJogadores.js.map