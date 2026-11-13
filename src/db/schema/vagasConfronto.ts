import { sql } from "drizzle-orm";
import { pgTable, uuid, smallint, check, uniqueIndex, index } from "drizzle-orm/pg-core";
import { confrontos } from "./confrontos.js";
import { inscricoes } from "./inscricoes.js";
import { slotOutcomeEnum } from "./enums.js";

/** slot 1 corresponde ao lado A; slot 2 corresponde ao lado B. */
export const vagasConfronto = pgTable("vagas_confronto", {
  id: uuid("id").defaultRandom().primaryKey(),
  confrontoId: uuid("confronto_id").notNull().references(() => confrontos.id, { onDelete: "cascade" }),
  slot: smallint("slot").notNull(),
  inscricaoId: uuid("inscricao_id").references(() => inscricoes.id, { onDelete: "restrict" }),
  confrontoOrigemId: uuid("confronto_origem_id").references(() => confrontos.id, { onDelete: "restrict" }),
  resultadoOrigem: slotOutcomeEnum("resultado_origem"),
}, (table) => [
  uniqueIndex("vagas_confronto_slot_unique").on(table.confrontoId, table.slot),
  index("vagas_confronto_inscricao_idx").on(table.inscricaoId),
  check("vagas_confronto_slot_check", sql`${table.slot} IN (1, 2)`),
  check("vagas_confronto_origem_check", sql`(${table.inscricaoId} IS NULL OR (${table.confrontoOrigemId} IS NULL AND ${table.resultadoOrigem} IS NULL)) AND (${table.confrontoOrigemId} IS NOT NULL OR ${table.resultadoOrigem} IS NULL) AND (${table.confrontoOrigemId} IS NULL OR ${table.resultadoOrigem} IS NOT NULL)`),
]);
