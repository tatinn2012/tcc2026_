import { sql } from "drizzle-orm";
import { pgTable, uuid, integer, text, timestamp, check, index } from "drizzle-orm/pg-core";
import { jogos } from "./jogos.js";
import { maos } from "./maos.js";
import { usuarios } from "./usuarios.js";
import { teamSideEnum, scoreEventReasonEnum } from "./enums.js";
/** Fonte auditável da pontuação; jogos.pontosLadoA/B são apenas cache de leitura. */
export const eventosPontuacao = pgTable("eventos_pontuacao", {
    id: uuid("id").defaultRandom().primaryKey(),
    jogoId: uuid("jogo_id").notNull().references(() => jogos.id, { onDelete: "restrict" }),
    maoId: uuid("mao_id").references(() => maos.id, { onDelete: "restrict" }),
    lado: teamSideEnum("lado").notNull(),
    pontosDelta: integer("pontos_delta").notNull(),
    motivo: scoreEventReasonEnum("motivo").notNull(),
    responsavelUsuarioId: uuid("responsavel_usuario_id").references(() => usuarios.id, { onDelete: "set null" }),
    observacao: text("observacao"),
    criadoEm: timestamp("criado_em", { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
    index("eventos_pontuacao_jogo_idx").on(table.jogoId),
    index("eventos_pontuacao_mao_idx").on(table.maoId),
    check("eventos_pontuacao_delta_check", sql `${table.pontosDelta} <> 0`),
]);
//# sourceMappingURL=eventosPontuacao.js.map